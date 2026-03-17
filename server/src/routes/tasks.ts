import { Router } from 'express';
import {
  getTasks,
  postTask,
  reorderTaskList,
  patchTask,
  deleteTask,
} from '../controllers/tasksController.js';

const router = Router();

router.get('/', getTasks);
router.post('/', postTask);
router.put('/reorder', reorderTaskList);
router.patch('/:id', patchTask);
router.delete('/:id', deleteTask);

export default router;
