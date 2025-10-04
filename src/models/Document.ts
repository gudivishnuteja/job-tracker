import mongoose, { Schema, Document as MDoc, Types } from 'mongoose';

export type DocumentType = 'resume' | 'cover';

export interface DocumentDoc extends MDoc {
  userId: Types.ObjectId;
  type: DocumentType;
  version: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<DocumentDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['resume', 'cover'], required: true },
    version: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

export const DocumentModel = mongoose.model<DocumentDoc>('Document', documentSchema);
