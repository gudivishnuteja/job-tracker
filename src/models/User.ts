import mongoose, { Schema, Document } from 'mongoose';

export interface UserDoc extends Document {
  name: string;
  email: string;
  passwordHash: string;
  timezone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    timezone: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDoc>('User', userSchema);
