// src/logic.ts
import type { TodoStatus } from './types.js';


export const calculateStatus = (createdAt: Date, currentStatus: TodoStatus): TodoStatus => {
  if (currentStatus === 'Done') return 'Done';

  const now = new Date();
  const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  if (diffInHours >= 24) {
    return 'Overdue';
  } else if (now.toDateString() === createdAt.toDateString()) {
    return 'Due';
  } else {
    return 'Coming Up';
  }
};