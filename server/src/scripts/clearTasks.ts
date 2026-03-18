/**
 * Clears all events (tasks) from the database.
 * Run: npx tsx src/scripts/clearTasks.ts
 * (from server directory, or: npx tsx server/src/scripts/clearTasks.ts from project root)
 */
import dotenv from 'dotenv';

// Ensure env is loaded when the script is executed from repo root.
dotenv.config({ path: new URL('../../.env', import.meta.url) });
import mongoose from 'mongoose';

async function clearTasks() {
  // Dynamic import so dotenv is evaluated before config reads env.
  const { MONGODB_URI } = await import('../config/index.js');
  const { Task } = await import('../models/Task.js');

  await mongoose.connect(MONGODB_URI!);
  const result = await Task.deleteMany({});
  console.log(`Deleted ${result.deletedCount} task(s).`);
  await mongoose.disconnect();
  process.exit(0);
}

clearTasks().catch((err) => {
  console.error(err);
  process.exit(1);
});
