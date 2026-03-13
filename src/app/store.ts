import { Queue, Task, AppState } from './types';

// Initial mock data
const initialQueues: Queue[] = [
  {
    id: 'queue-1',
    name: 'Work Tasks',
    color: '#3b82f6',
    tasks: [
      {
        id: 'task-1',
        title: 'Finish project proposal',
        description: 'Complete the Q2 project proposal document',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-2',
        title: 'Review code',
        description: 'Review pull requests from team',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-3',
        title: 'Team meeting preparation',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'queue-2',
    name: 'Personal',
    color: '#10b981',
    tasks: [
      {
        id: 'task-4',
        title: 'Grocery shopping',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-5',
        title: 'Call dentist',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

class AppStore {
  private state: AppState = {
    queues: initialQueues,
    currentQueueId: null,
  };

  private listeners: Set<() => void> = new Set();

  getState(): AppState {
    return this.state;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  // Queue operations
  addQueue(name: string, color: string, parentTaskId?: string) {
    const newQueue: Queue = {
      id: `queue-${Date.now()}`,
      name,
      color,
      tasks: [],
      parentTaskId,
      createdAt: new Date().toISOString(),
    };
    this.state.queues.push(newQueue);
    this.notify();
    return newQueue;
  }

  updateQueue(queueId: string, updates: Partial<Queue>) {
    const queue = this.state.queues.find(q => q.id === queueId);
    if (queue) {
      Object.assign(queue, updates);
      this.notify();
    }
  }

  deleteQueue(queueId: string) {
    this.state.queues = this.state.queues.filter(q => q.id !== queueId);
    this.notify();
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

  // Task operations
  addTask(queueId: string, title: string, description?: string, color?: string) {
    const queue = this.getQueue(queueId);
    if (queue) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        description,
        color,
        createdAt: new Date().toISOString(),
      };
      queue.tasks.push(newTask);
      this.notify();
      return newTask;
    }
  }

  updateTask(queueId: string, taskId: string, updates: Partial<Task>) {
    const queue = this.getQueue(queueId);
    if (queue) {
      const task = queue.tasks.find(t => t.id === taskId);
      if (task) {
        Object.assign(task, updates);
        this.notify();
      }
    }
  }

  deleteTask(queueId: string, taskId: string) {
    const queue = this.getQueue(queueId);
    if (queue) {
      queue.tasks = queue.tasks.filter(t => t.id !== taskId);
      // Also delete subqueue if exists
      const subQueue = this.getSubQueue(taskId);
      if (subQueue) {
        this.deleteQueue(subQueue.id);
      }
      this.notify();
    }
  }

  reorderTasks(queueId: string, startIndex: number, endIndex: number) {
    const queue = this.getQueue(queueId);
    if (queue) {
      const newTasks = [...queue.tasks];
      const [removed] = newTasks.splice(startIndex, 1);
      newTasks.splice(endIndex, 0, removed);
      queue.tasks = newTasks;
      this.notify();
    }
  }

  createSubQueue(taskId: string, queueId: string): Queue | undefined {
    const queue = this.getQueue(queueId);
    const task = queue?.tasks.find(t => t.id === taskId);
    
    if (task && !task.subQueueId) {
      const subQueue = this.addQueue(`${task.title} - Subtasks`, '#8b5cf6', taskId);
      task.subQueueId = subQueue.id;
      this.notify();
      return subQueue;
    }
    
    return this.getSubQueue(taskId);
  }

  setCurrentQueue(queueId: string | null) {
    this.state.currentQueueId = queueId;
    this.notify();
  }
}

export const appStore = new AppStore();