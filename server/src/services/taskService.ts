import { Task } from '../models/Task.js';
import type { ITask } from '../models/Task.js';

export async function findAllTasks(date?: string): Promise<ITask[]> {
  const filter = date && typeof date === 'string' ? { date } : {};
  return Task.find(filter).sort({ date: 1, order: 1 }).lean();
}

export async function createTask(data: {
  date: string;
  title: string;
  order?: number;
  labels?: string[];
  startTime?: string;
  endTime?: string;
  countryCodes?: string[];
}): Promise<ITask> {
  const { date, title, order, labels, startTime, endTime, countryCodes } = data;
  const maxOrder = await Task.findOne({ date }).sort({ order: -1 }).select('order').lean();
  const task = await Task.create({
    date,
    title: title.trim(),
    order: typeof order === 'number' ? order : (maxOrder?.order ?? -1) + 1,
    labels: Array.isArray(labels) ? labels : [],
    countryCodes: Array.isArray(countryCodes) ? countryCodes : [],
    ...(startTime != null && { startTime }),
    ...(endTime != null && { endTime }),
  });
  return task.toObject();
}

export async function updateTask(
  id: string,
  update: { date?: string; title?: string; order?: number; labels?: string[]; startTime?: string; endTime?: string; countryCodes?: string[] }
): Promise<ITask | null> {
  const payload: Record<string, unknown> = {};
  if (update.date !== undefined) payload.date = update.date;
  if (update.title !== undefined) payload.title = update.title.trim();
  if (update.order !== undefined) payload.order = update.order;
  if (update.labels !== undefined) payload.labels = Array.isArray(update.labels) ? update.labels : [];
  if (update.startTime !== undefined) payload.startTime = update.startTime;
  if (update.endTime !== undefined) payload.endTime = update.endTime;
  if (update.countryCodes !== undefined) payload.countryCodes = Array.isArray(update.countryCodes) ? update.countryCodes : [];
  const task = await Task.findByIdAndUpdate(id, payload, { new: true }).lean();
  return task ?? null;
}

export async function deleteTask(id: string): Promise<boolean> {
  const result = await Task.findByIdAndDelete(id);
  return result != null;
}

export async function reorderTasks(
  date: string,
  taskIds: string[]
): Promise<ITask[]> {
  const updates = taskIds.map((id, index) =>
    Task.updateOne({ _id: id, date }, { order: index })
  );
  await Promise.all(updates);
  return Task.find({ date }).sort({ order: 1 }).lean();
}
