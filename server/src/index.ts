import 'dotenv/config';
import { connectDb } from './config/db.js';
import app from './app.js';
import { PORT } from './config/index.js';

async function start() {
  await connectDb();
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

start();
