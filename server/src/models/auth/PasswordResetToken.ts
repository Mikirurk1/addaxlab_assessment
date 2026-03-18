import { Schema, model } from 'mongoose';

export interface IPasswordResetToken {
  email: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    email: { type: String, required: true, index: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: undefined },
  },
  { timestamps: true }
);

passwordResetTokenSchema.pre('validate', function (next) {
  this.email = String(this.email ?? '').trim().toLowerCase();
  this.tokenHash = String(this.tokenHash ?? '').trim();
  next();
});

// Automatically remove expired tokens.
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetToken = model<IPasswordResetToken>(
  'PasswordResetToken',
  passwordResetTokenSchema
);

