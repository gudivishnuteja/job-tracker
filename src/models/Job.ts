import mongoose, { Schema, Document, Types } from 'mongoose';

export type JobStatus =
  | 'Backlog'
  | 'Saved'
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Joined'
  | 'Rejected';

export interface JobDoc extends Document {
  userId: Types.ObjectId;
  title: string;
  company: string;
  location?: string;
  status: JobStatus;
  tags: string[];
  deadline?: Date;
  sourceLink?: string;
  compensation?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<JobDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    status: {
      type: String,
      enum: ['Backlog', 'Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Joined', 'Rejected'],
      default: 'Backlog',
      index: true,
    },
    tags: { type: [String], default: [] },
    deadline: { type: Date },
    sourceLink: { type: String },
    compensation: { type: String },
  },
  { timestamps: true }
);

export const Job = mongoose.model<JobDoc>('Job', jobSchema);
