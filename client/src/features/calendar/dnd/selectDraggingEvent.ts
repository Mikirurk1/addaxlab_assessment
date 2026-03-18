import type { RootState } from '@/store';
import type { TaskItem } from '@/features/calendar/types';

export function selectDraggingEvent(state: RootState): TaskItem | null {
  const id = state.ui.draggingTaskId;
  if (!id) return null;
  return state.tasks.items.find((t) => t._id === id) ?? null;
}

