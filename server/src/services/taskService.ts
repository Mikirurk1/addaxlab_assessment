import { Task } from '../models/Task.js';
import type { ITask } from '../models/Task.js';
import { getNickname } from './nicknameService.js';

export async function findAllTasks(date?: string): Promise<ITask[]> {
  const filter = date && typeof date === 'string' ? { date } : {};
  return Task.find(filter).sort({ date: 1, order: 1 }).lean();
}

export async function findTaskById(id: string): Promise<ITask | null> {
  const task = await Task.findById(id).lean();
  return task ?? null;
}

export async function findTasksByIds(ids: string[]): Promise<ITask[]> {
  if (ids.length === 0) return [];
  const tasks = await Task.find({ _id: { $in: ids } }).lean();
  return tasks;
}

export async function findTasksBySeriesId(seriesId: string): Promise<ITask[]> {
  return Task.find({ seriesId }).lean();
}

export async function createTask(data: {
  date: string;
  title: string;
  order?: number;
  labels?: string[];
  startTime?: string;
  endTime?: string;
  createdBy?: { name: string; email: string };
  countryCodes?: string[];
  seriesId?: string;
  recurrence?: { freq: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'; byWeekDays?: number[] };
}): Promise<ITask> {
  const { date, title, order, labels, startTime, endTime, createdBy, countryCodes, seriesId, recurrence } = data;
  const maxOrder = await Task.findOne({ date }).sort({ order: -1 }).select('order').lean();
  const createdByWithNick =
    createdBy?.email
      ? {
          name: createdBy.name,
          email: createdBy.email,
          nickname: getNickname(createdBy.email) ?? undefined,
        }
      : undefined;
  const task = await Task.create({
    date,
    title: title.trim(),
    order: typeof order === 'number' ? order : (maxOrder?.order ?? -1) + 1,
    labels: Array.isArray(labels) ? labels : [],
    countryCodes: Array.isArray(countryCodes) ? countryCodes : [],
    ...(createdByWithNick ? { createdBy: createdByWithNick } : {}),
    ...(startTime != null && { startTime }),
    ...(endTime != null && { endTime }),
    ...(seriesId != null && { seriesId }),
    ...(recurrence != null && { recurrence }),
  });
  return task.toObject();
}

export async function updateTask(
  id: string,
  update: { date?: string; title?: string; order?: number; labels?: string[]; startTime?: string; endTime?: string; countryCodes?: string[]; seriesId?: string | null; recurrence?: { freq: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'; byWeekDays?: number[] } | null }
): Promise<ITask | null> {
  const payload: Record<string, unknown> = {};
  if (update.date !== undefined) payload.date = update.date;
  if (update.title !== undefined) payload.title = update.title.trim();
  if (update.order !== undefined) payload.order = update.order;
  if (update.labels !== undefined) payload.labels = Array.isArray(update.labels) ? update.labels : [];
  if (update.startTime !== undefined) payload.startTime = update.startTime;
  if (update.endTime !== undefined) payload.endTime = update.endTime;
  if (update.countryCodes !== undefined) payload.countryCodes = Array.isArray(update.countryCodes) ? update.countryCodes : [];
  if (update.seriesId !== undefined) payload.seriesId = update.seriesId;
  if (update.recurrence !== undefined) payload.recurrence = update.recurrence;
  const task = await Task.findByIdAndUpdate(id, payload, { new: true }).lean();
  return task ?? null;
}

export async function createTasksBulk(tasks: Array<{
  date: string;
  title: string;
  order?: number;
  labels?: string[];
  startTime?: string;
  endTime?: string;
  createdBy?: { name: string; email: string };
  countryCodes?: string[];
  seriesId?: string;
  recurrence?: { freq: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'; byWeekDays?: number[] };
}>): Promise<ITask[]> {
  if (!Array.isArray(tasks) || tasks.length === 0) return [];
  const docs = tasks.map((t) => {
    const createdByWithNick =
      t.createdBy?.email
        ? {
            name: t.createdBy.name,
            email: t.createdBy.email,
            nickname: getNickname(t.createdBy.email) ?? undefined,
          }
        : undefined;
    return {
      date: t.date,
      title: t.title.trim(),
      order: typeof t.order === 'number' ? t.order : 0,
      labels: Array.isArray(t.labels) ? t.labels : [],
      countryCodes: Array.isArray(t.countryCodes) ? t.countryCodes : [],
      ...(createdByWithNick ? { createdBy: createdByWithNick } : {}),
      ...(t.startTime != null && { startTime: t.startTime }),
      ...(t.endTime != null && { endTime: t.endTime }),
      ...(t.seriesId != null && { seriesId: t.seriesId }),
      ...(t.recurrence != null && { recurrence: t.recurrence }),
    };
  });
  const created = await Task.insertMany(docs);
  return created.map((d) => d.toObject());
}

export async function updateSeries(
  seriesId: string,
  update: { title?: string; labels?: string[]; startTime?: string; endTime?: string; countryCodes?: string[] }
): Promise<number> {
  const payload: Record<string, unknown> = {};
  if (update.title !== undefined) payload.title = update.title.trim();
  if (update.labels !== undefined) payload.labels = Array.isArray(update.labels) ? update.labels : [];
  if (update.startTime !== undefined) payload.startTime = update.startTime;
  if (update.endTime !== undefined) payload.endTime = update.endTime;
  if (update.countryCodes !== undefined) payload.countryCodes = Array.isArray(update.countryCodes) ? update.countryCodes : [];
  const res = await Task.updateMany({ seriesId }, payload);
  return res.modifiedCount ?? 0;
}

export async function detachFromSeries(id: string): Promise<ITask | null> {
  const task = await Task.findByIdAndUpdate(
    id,
    { seriesId: null, recurrence: { freq: 'none' } },
    { new: true }
  ).lean();
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
