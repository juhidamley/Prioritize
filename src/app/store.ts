// Prioritize app store.
//
// Data lives in Neon and is reached over /api/queues and /api/tasks (see
// src/app/api.ts). Supabase remains in two roles only: the identity provider
// behind supabase.auth, and the Realtime transport used to tell other tabs and
// devices that something changed — see subscribeToRealtime() below.
//
// Guest mode is unchanged: with no signed-in user everything stays in
// localStorage and no request is made.

import { Queue, Task, AppState } from './types';
import { supabase } from '../../utils/supabase/client';
import { api, ApiQueue, ApiTask } from './api';
import type { RealtimeChannel } from '@supabase/supabase-js';

const LOCAL_KEY = 'prioritize_local_data';

// Postgres hands back snake_case; the components want the camelCase shapes in
// ./types. These two mappers are the only place that translation happens.
function toTask(t: ApiTask): Task {
  return {
    id: t.id,
    title: t.title,
    description: t.description ?? undefined,
    color: t.color ?? undefined,
    subQueueId: t.sub_queue_id ?? undefined,
    createdAt: t.created_at,
    sort_order: t.sort_order,
  };
}

function toQueue(q: ApiQueue): Queue {
  return {
    id: q.id,
    name: q.name,
    color: q.color,
    palette: q.palette,
    parentTaskId: q.parent_task_id ?? undefined,
    createdAt: q.created_at,
    tasks: (q.tasks || []).map(toTask),
  };
}

class AppStore {
  private state: AppState = {
    queues: [],
    currentQueueId: null,
    user: null,
    isLoading: true,
  };

  private listeners: Set<() => void> = new Set();

  // Supabase Realtime channel used purely as a pub/sub pipe (see
  // subscribeToRealtime). Null while signed out.
  private channel: RealtimeChannel | null = null;

  async signOut() {
    this.teardownChannel();
    await supabase.auth.signOut();
    this.state.queues = []; // Clear local data on logout
    this.notify();
  }

  getState(): AppState {
    return this.state;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.state = {
      ...this.state,
      queues: [...this.state.queues]
    };

    // Save to local storage if acting as a guest
    if (!this.state.user) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(this.state.queues));
    }

    this.listeners.forEach(listener => listener());
  }

  private loadLocal() {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      try { this.state.queues = JSON.parse(saved); } catch (e) { this.state.queues = []; }
    } else {
      this.state.queues = [];
    }
  }

  async initializeAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    this.state.user = session?.user ?? null;

    if (this.state.user) {
      this.fetchQueues(); // Fetch from cloud
    } else {
      // Fetch from local browser storage
      this.loadLocal();
      this.state.isLoading = false;
      this.notify();
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      if (this.state.user?.id !== newUser?.id) {
         this.state.user = newUser;
         this.teardownChannel();
         if (newUser) this.fetchQueues();
         else {
           this.loadLocal();
           this.notify();
         }
      }
    });
  }

  async addQueue(name: string, color: string, palette: string[], parentTaskId?: string) {
    // 1. LOCAL MODE
    if (!this.state.user) {
      const newQueue: Queue = {
        id: `local-queue-${Date.now()}`,
        name, color, palette, tasks: [],
        parentTaskId: parentTaskId || undefined,
        createdAt: new Date().toISOString(),
      };
      this.state.queues.push(newQueue);
      this.notify();
      return newQueue;
    }

    // 2. CLOUD MODE
    try {
      const { queue } = await api.createQueue({ name, color, palette, parentTaskId });
      await this.fetchQueues();
      this.broadcastChange();
      return toQueue(queue);
    } catch (error) {
      console.error('Error creating queue:', error);
      return;
    }
  }

  async addTask(queueId: string, title: string, description?: string, explicitColor?: string) {
    const queue = this.getQueue(queueId);
    if (!queue) return;

    let taskColor = explicitColor;
    if (!taskColor && queue.palette && queue.palette.length > 0) {
      const lastTask = queue.tasks[queue.tasks.length - 1];
      const safeColors = queue.palette.filter(c => c !== lastTask?.color);
      taskColor = (safeColors.length > 0 ? safeColors : queue.palette)[Math.floor(Math.random() * (safeColors.length || queue.palette.length))];
    }

    const newSortOrder = queue.tasks.length > 0 ? queue.tasks[queue.tasks.length - 1].sort_order + 100 : 0;

    // 1. LOCAL MODE
    if (!this.state.user) {
      const newTask: Task = {
        id: `local-task-${Date.now()}`,
        title, description, color: taskColor, sort_order: newSortOrder, createdAt: new Date().toISOString(),
      };
      queue.tasks.push(newTask);
      this.notify();
      return newTask;
    }

    // 2. CLOUD MODE
    try {
      await api.createTask({
        queueId, title, description, color: taskColor, sortOrder: newSortOrder,
      });
      await this.fetchQueues();
      this.broadcastChange();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }

  async updateQueue(queueId: string, updates: Partial<Queue>) {
    // LOCAL MODE
    if (!this.state.user) {
      const queue = this.getQueue(queueId);
      if (!queue) return;
      if (updates.name !== undefined) queue.name = updates.name;
      if (updates.color !== undefined) queue.color = updates.color;
      if (updates.palette !== undefined) queue.palette = updates.palette;
      this.notify();
      return;
    }

    try {
      await api.updateQueue({
        id: queueId, name: updates.name, color: updates.color, palette: updates.palette,
      });
      await this.fetchQueues();
      this.broadcastChange();
    } catch (error) {
      console.error('Error updating queue:', error);
    }
  }

  async deleteQueue(queueId: string) {
    // LOCAL MODE
    if (!this.state.user) {
      this.state.queues = this.state.queues.filter(q => q.id !== queueId);
      this.notify();
      return;
    }

    // Tasks and member rows go with it: the Neon schema keeps the same
    // ON DELETE CASCADE the Supabase schema had.
    try {
      await api.deleteQueue(queueId);
      this.state.queues = this.state.queues.filter(q => q.id !== queueId);
      this.notify();
      this.broadcastChange();
    } catch (error) {
      console.error('Error deleting queue:', error);
    }
  }

  getQueue(queueId: string): Queue | undefined {
    return this.state.queues.find(q => q.id === queueId);
  }

  getMainQueues(): Queue[] {
    return this.state.queues.filter(q => !q.parentTaskId);
  }

  getSubQueue(taskId: string): Queue | undefined {
    return this.state.queues.find(q => q.parentTaskId === taskId);
  }

  async updateTask(queueId: string, taskId: string, updates: Partial<Task>) {
    // LOCAL MODE
    if (!this.state.user) {
      const task = this.getQueue(queueId)?.tasks.find(t => t.id === taskId);
      if (!task) return;
      if (updates.title !== undefined) task.title = updates.title;
      if (updates.description !== undefined) task.description = updates.description;
      if (updates.color !== undefined) task.color = updates.color;
      this.notify();
      return;
    }

    try {
      await api.updateTask({
        id: taskId,
        title: updates.title,
        description: updates.description,
        color: updates.color,
      });
      await this.fetchQueues();
      this.broadcastChange();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async deleteTask(queueId: string, taskId: string) {
    // LOCAL MODE
    if (!this.state.user) {
      const queue = this.getQueue(queueId);
      if (!queue) return;
      queue.tasks = queue.tasks.filter(t => t.id !== taskId);
      this.notify();
      return;
    }

    try {
      await api.deleteTask(taskId);
      await this.fetchQueues();
      this.broadcastChange();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  reorderTasks(queueId: string, dragIndex: number, hoverIndex: number) {
    const queue = this.getQueue(queueId);
    if (!queue) return;

    const newTasks = [...queue.tasks];
    const [removed] = newTasks.splice(dragIndex, 1);
    newTasks.splice(hoverIndex, 0, removed);
    queue.tasks = newTasks;

    let newSortOrder = 0;
    if (hoverIndex === 0) newSortOrder = newTasks[1] ? newTasks[1].sort_order - 100 : 0;
    else if (hoverIndex === newTasks.length - 1) newSortOrder = newTasks[hoverIndex - 1].sort_order + 100;
    else newSortOrder = (newTasks[hoverIndex - 1].sort_order + newTasks[hoverIndex + 1].sort_order) / 2;

    newTasks[hoverIndex].sort_order = newSortOrder;
    this.notify();

    // STOP HERE IF GUEST (Skip DB sync)
    if (!this.state.user) return;

    // Fire-and-forget: the local reorder above already moved the card, so this
    // only persists it. Deliberately does not refetch — that would fight the
    // drag still in progress.
    api.updateTask({ id: removed.id, sortOrder: newSortOrder })
      .then(() => this.broadcastChange())
      .catch(error => console.error('Error syncing order:', error));
  }

  async createSubQueue(taskId: string, queueId: string) {
    const queue = this.getQueue(queueId);
    const task = queue?.tasks.find(t => t.id === taskId);

    if (task && !task.subQueueId) {
      // Create the new queue, linking it to the parent task
      const subQueue = await this.addQueue(
        `${task.title} - Subtasks`,
        '#8b5cf6',
        queue?.palette || [],
        taskId
      );

      if (subQueue) {
        // 1. LOCAL MODE (Guest)
        if (!this.state.user) {
          task.subQueueId = subQueue.id;
          this.notify();
          return subQueue;
        }

        // 2. CLOUD MODE (Logged In)
        try {
          await api.updateTask({ id: taskId, subQueueId: subQueue.id });
          await this.fetchQueues();
          this.broadcastChange();
        } catch (error) {
          console.error('Error linking sub-queue:', error);
        }
        return subQueue;
      }
    }
    return this.getSubQueue(taskId);
  }

  setCurrentQueue(queueId: string | null) {
    this.state.currentQueueId = queueId;
    this.notify();
  }

  // 1. Fetch all data from the cloud
  async fetchQueues() {
    if (!this.state.user) return;

    this.state.isLoading = true;
    this.notify();

    try {
      // One request: /api/queues assembles queues with their tasks (ordered by
      // sort_order) server-side, so there's no second query to join in JS.
      const { queues } = await api.listQueues();
      this.state.queues = queues.map(toQueue);
      this.ensureChannel();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.state.isLoading = false;
      this.notify();
    }
  }

  // 2. The Real-time Listener
  //
  // Supabase Realtime is still the transport, but the mechanism changed with
  // the move to Neon. It used to listen for `postgres_changes` on the Supabase
  // tables; those tables no longer receive writes, so such a listener would
  // never fire. Instead this is a Broadcast channel: whoever makes a change
  // calls broadcastChange(), and every *other* subscriber refetches from Neon.
  //
  // The payload is empty on purpose — it's a "something moved, go look" ping,
  // never the data itself, so the channel carries nothing worth intercepting.
  private ensureChannel() {
    if (this.channel || !this.state.user) return;

    this.channel = supabase
      .channel(`prioritize:${this.state.user.id}`)
      .on('broadcast', { event: 'changed' }, () => {
        // Supabase does not echo a client's own broadcasts back to it, so this
        // only runs for changes made by another tab, device, or collaborator.
        this.fetchQueues();
      })
      .subscribe();
  }

  private teardownChannel() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }

  /** Tell other subscribers that this user's data changed. */
  private broadcastChange() {
    this.channel?.send({ type: 'broadcast', event: 'changed', payload: {} });
  }

  /**
   * Start listening for changes from other clients. Safe to call more than
   * once. Returns a cleanup function for use from a React effect.
   */
  subscribeToRealtime() {
    if (!this.state.user) return;
    this.ensureChannel();
    return () => this.teardownChannel();
  }
}

export const appStore = new AppStore();
