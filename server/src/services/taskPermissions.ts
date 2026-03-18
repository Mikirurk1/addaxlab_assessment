import type { ITask } from '../models/Task.js';
import type { Caller } from '../middlewares/taskAuth.js';

export function canEditTask(caller: Caller, task: ITask | null): boolean {
  if (!task) return true;
  if (caller.role === 'admin' || caller.role === 'super-admin') return true;
  const ownerEmail = task.createdBy?.email;
  if (!ownerEmail) return true;
  return ownerEmail.toLowerCase() === caller.email;
}

export function canDeleteTask(caller: Caller, task: ITask | null): boolean {
  return canEditTask(caller, task);
}
