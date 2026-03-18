import { Router } from 'express';
import { getStrings } from '../controllers/contentController.js';

const router = Router();

router.get('/strings', getStrings);

export default router;

