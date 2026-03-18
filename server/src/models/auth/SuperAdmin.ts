import { Schema, model } from "mongoose";

export interface ISuperAdmin {
  email: string;
  name: string;
  passwordHash: string;
}

const superAdminSchema = new Schema<ISuperAdmin>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

superAdminSchema.pre("validate", function (next) {
  this.email = String(this.email ?? "").trim().toLowerCase();
  this.name = String(this.name ?? "").trim();
  next();
});

export const SuperAdmin = model<ISuperAdmin>("SuperAdmin", superAdminSchema);

