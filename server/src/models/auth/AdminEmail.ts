import { Schema, model } from "mongoose";

export interface IAdminEmail {
  email: string;
}

const adminEmailSchema = new Schema<IAdminEmail>(
  {
    email: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

adminEmailSchema.pre("validate", function (next) {
  this.email = String(this.email ?? "").trim().toLowerCase();
  next();
});

export const AdminEmail = model<IAdminEmail>("AdminEmail", adminEmailSchema);

