import mongoose, { Schema, model } from "mongoose";

export interface ITask {
  _id: mongoose.Types.ObjectId;
  date: string;
  title: string;
  order: number;
  labels: string[];
  startTime?: string;
  endTime?: string;
  /** Country codes this event is tied to; empty = all countries. */
  countryCodes?: string[];
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
    countryCodes: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const Task = model<ITask>("Task", taskSchema);
