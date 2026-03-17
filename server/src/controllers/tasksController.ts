import type { Request, Response } from 'express';
import * as taskService from '../services/taskService.js';

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
    const { date, title, order, labels, startTime, endTime, countryCodes } = req.body;
    if (!date || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ error: 'date and title are required' });
      return;
    }
    const task = await taskService.createTask({ date, title, order, labels, startTime, endTime, countryCodes });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
}

export async function reorderTaskList(req: Request, res: Response): Promise<void> {
  try {
    const { date, taskIds } = req.body;
    if (!date || !Array.isArray(taskIds) || taskIds.length === 0) {
      res.status(400).json({ error: 'date and taskIds array required' });
      return;
    }
    const tasks = await taskService.reorderTasks(date, taskIds);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reorder tasks' });
  }
}

export async function patchTask(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { date, title, order, labels, startTime, endTime, countryCodes } = req.body;
    const task = await taskService.updateTask(id, { date, title, order, labels, startTime, endTime, countryCodes });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const found = await taskService.deleteTask(req.params.id);
    if (!found) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
}
