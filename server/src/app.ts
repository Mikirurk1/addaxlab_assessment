import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';
import contentRouter from './routes/content.js';
import authRouter from './routes/auth.js';

const app = express();

app.use(cors());
// Avatar upload sends base64 image (~100–500 KB); default json limit is 100kb
app.use(express.json({ limit: '2mb' }));
app.use('/api/tasks', tasksRouter);
app.use('/api/content', contentRouter);
app.use('/api/auth', authRouter);

export default app;
