export type TodoStatus = 'Coming Up' | 'Due' | 'Overdue' | 'Done';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
}