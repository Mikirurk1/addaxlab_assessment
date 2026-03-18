import type { Request, Response } from 'express';
import * as taskService from '../services/taskService.js';
import { canEditTask, canDeleteTask } from '../services/taskPermissions.js';
import { broadcast } from '../websockets/broadcast.js';

export async function getTasks(req: Request, res: Response): Promise<void> {
  try {
    const { date } = req.query;
    const tasks = await taskService.findAllTasks(date as string | undefined);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

export async function postTask(req: Request, res: Response): Promise<void> {
  try {
    const caller = req.caller!;
    const { date, title, order, labels, startTime, endTime, countryCodes, seriesId, recurrence } = req.body;
    if (!date || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ error: 'date and title are required' });
      return;
    }
    const createdBy = { name: caller.name, email: caller.email };
    const task = await taskService.createTask({ date, title, order, labels, startTime, endTime, createdBy, countryCodes, seriesId, recurrence });
    broadcast({ type: 'tasks_refresh' });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
}

export async function reorderTaskList(req: Request, res: Response): Promise<void> {
  try {
    const caller = req.caller!;
    const { date, taskIds } = req.body;
    if (!date || !Array.isArray(taskIds) || taskIds.length === 0) {
      res.status(400).json({ error: 'date and taskIds array required' });
      return;
    }
    const existing = await taskService.findTasksByIds(taskIds);
    if (existing.length !== taskIds.length) {
      res.status(404).json({ error: 'One or more tasks not found' });
      return;
    }
    const canReorder = existing.every((t) => canEditTask(caller, t));
    if (!canReorder) {
      res.status(403).json({ error: 'Not allowed to reorder these tasks' });
      return;
    }
    const tasks = await taskService.reorderTasks(date, taskIds);
    broadcast({ type: 'tasks_refresh' });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reorder tasks' });
  }
}

export async function patchTask(req: Request, res: Response): Promise<void> {
  try {
    const caller = req.caller!;
    const { id } = req.params;
    const existing = await taskService.findTaskById(id);
    if (!existing) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    if (!canEditTask(caller, existing)) {
      res.status(403).json({ error: 'Not allowed to edit this task' });
      return;
    }
    const { date, title, order, labels, startTime, endTime, countryCodes, seriesId, recurrence } = req.body;
    const task = await taskService.updateTask(id, { date, title, order, labels, startTime, endTime, countryCodes, seriesId, recurrence });
    broadcast({ type: 'tasks_refresh' });
    res.json(task!);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
}

export async function postTasksBulk(req: Request, res: Response): Promise<void> {
  try {
    const caller = req.caller!;
    const { tasks } = req.body;
    if (!Array.isArray(tasks) || tasks.length === 0) {
      res.status(400).json({ error: 'tasks array required' });
      return;
    }
    const createdBy = { name: caller.name, email: caller.email };
    const withCreator = (tasks as Array<Record<string, unknown>>).map((t) => ({ ...t, createdBy }));
    const created = await taskService.createTasksBulk(withCreator as Parameters<typeof taskService.createTasksBulk>[0]);
    broadcast({ type: 'tasks_refresh' });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create tasks' });
  }
}

export async function patchSeries(req: Request, res: Response): Promise<void> {
  try {
    const caller = req.caller!;
    const { seriesId } = req.params;
    if (!seriesId) {
      res.status(400).json({ error: 'seriesId required' });
      return;
    }
    const seriesTasks = await taskService.findTasksBySeriesId(seriesId);
    if (seriesTasks.length === 0) {
      res.status(404).json({ error: 'Series not found' });
      return;
    }
    const canEdit = seriesTasks.some((t) => canEditTask(caller, t));
    if (!canEdit) {
      res.status(403).json({ error: 'Not allowed to edit this series' });
      return;
    }
    const { title, labels, startTime, endTime, countryCodes } = req.body;
    const modifiedCount = await taskService.updateSeries(seriesId, { title, labels, startTime, endTime, countryCodes });
    broadcast({ type: 'tasks_refresh' });
    res.json({ modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update series' });
  }
}

export async function detachTask(req: Request, res: Response): Promise<void> {
  try {
    const caller = req.caller!;
    const { id } = req.params;
    const existing = await taskService.findTaskById(id);
    if (!existing) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    if (!canEditTask(caller, existing)) {
      res.status(403).json({ error: 'Not allowed to edit this task' });
      return;
    }
    const task = await taskService.detachFromSeries(id);
    broadcast({ type: 'tasks_refresh' });
    res.json(task!);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to detach task' });
  }
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const caller = req.caller!;
    const existing = await taskService.findTaskById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    if (!canDeleteTask(caller, existing)) {
      res.status(403).json({ error: 'Not allowed to delete this task' });
      return;
    }
    await taskService.deleteTask(req.params.id);
    broadcast({ type: 'tasks_refresh' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
}
