import mongoose, { Schema, model } from "mongoose";

export interface ITask {
  _id: mongoose.Types.ObjectId;
  date: string;
  title: string;
  order: number;
  labels: string[];
  startTime?: string;
  endTime?: string;
  createdBy?: {
    name: string;
    email: string;
    nickname?: string;
  };
  /** Country codes this event is tied to; empty = all countries. */
  countryCodes?: string[];
  /** If set, this task is linked to a series (range/recurrence). */
  seriesId?: string;
  recurrence?: {
    freq: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    byWeekDays?: number[]; // 0=Sun ... 6=Sat (only for weekly)
  };
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    date: { type: String, required: true, index: true },
    title: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    labels: { type: [String], default: [] },
    startTime: { type: String, required: false },
    endTime: { type: String, required: false },
    createdBy: {
      name: { type: String, required: false },
      email: { type: String, required: false, index: true },
      nickname: { type: String, required: false },
    },
    countryCodes: { type: [String], default: [] },
    seriesId: { type: String, required: false, index: true },
    recurrence: {
      freq: { type: String, required: false, default: 'none' },
      byWeekDays: { type: [Number], required: false, default: undefined },
    },
  },
  { timestamps: true },
);

export const Task = model<ITask>("Task", taskSchema);
