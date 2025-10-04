import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ApplicationDoc extends Document {
  jobId: Types.ObjectId;
  resumeVersionId?: Types.ObjectId;
  appliedOn?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<ApplicationDoc>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    resumeVersionId: { type: Schema.Types.ObjectId, ref: 'Document' },
    appliedOn: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Application = mongoose.model<ApplicationDoc>('Application', applicationSchema);
