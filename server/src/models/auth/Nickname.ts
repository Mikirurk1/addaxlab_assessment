import { Schema, model } from "mongoose";

export interface INickname {
  email: string;
  nickname: string;
  nicknameNormalized: string;
}

const nicknameSchema = new Schema<INickname>(
  {
    email: { type: String, required: true, unique: true, index: true },
    nickname: { type: String, required: true },
    nicknameNormalized: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

nicknameSchema.pre("validate", function (next) {
  this.email = String(this.email ?? "").trim().toLowerCase();
  this.nickname = String(this.nickname ?? "").trim();
  this.nicknameNormalized = String(this.nicknameNormalized ?? this.nickname ?? "")
    .trim()
    .toLowerCase();
  next();
});

export const Nickname = model<INickname>("Nickname", nicknameSchema);

