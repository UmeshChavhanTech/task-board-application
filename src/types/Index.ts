export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  createdBy: string;
  columnId: string;
  order: number;
}

export interface Column {
  id: string;
  title: string;
  boardId: string;
  order: number;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  columns: Column[];
}

export type Priority = 'high' | 'medium' | 'low';
