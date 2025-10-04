import mongoose, { Schema, Document, Types } from 'mongoose';

export type ReminderType = 'deadline' | 'interview';

export interface ReminderDoc extends Document {
  jobId: Types.ObjectId;
  type: ReminderType;
  dueAt: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reminderSchema = new Schema<ReminderDoc>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    type: { type: String, enum: ['deadline', 'interview'], required: true },
    dueAt: { type: Date, required: true },
    note: { type: String },
  },
  { timestamps: true }
);

export const Reminder = mongoose.model<ReminderDoc>('Reminder', reminderSchema);
