export interface Task {
  id: string;
  title: string;
  description?: string;
  subQueueId?: string; // Reference to a queue that is this task's subqueue
  createdAt: string;
  color?: string; // Task color for visual organization
}

export interface Queue {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
  parentTaskId?: string; // If this queue is a subqueue of a task
  createdAt: string;
}

export interface AppState {
  queues: Queue[];
  currentQueueId: string | null;
}