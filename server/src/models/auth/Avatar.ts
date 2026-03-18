import { Schema, model } from "mongoose";

export interface IAvatar {
  email: string;
  contentType: string;
  data: Buffer;
}

const avatarSchema = new Schema<IAvatar>(
  {
    email: { type: String, required: true, unique: true, index: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

avatarSchema.pre("validate", function (next) {
  this.email = String(this.email ?? "").trim().toLowerCase();
  this.contentType = String(this.contentType ?? "").trim();
  next();
});

export const Avatar = model<IAvatar>("Avatar", avatarSchema);

