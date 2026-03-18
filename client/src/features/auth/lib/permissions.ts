import type { TaskItem } from '@/features/calendar/types';
import type { Role } from '@/features/auth/lib/roles';

export type SessionUser = { name: string; email: string; role: Role };

export function canEditTask(user: SessionUser | null, task: TaskItem | null): boolean {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'super-admin') return true;
  if (!task) return true; // creating new
  const ownerEmail = task.createdBy?.email;
  if (!ownerEmail) return true; // legacy tasks
  return ownerEmail.toLowerCase() === user.email.toLowerCase();
}

export function canDeleteTask(user: SessionUser | null, task: TaskItem | null): boolean {
  // same policy for now
  return canEditTask(user, task);
}

