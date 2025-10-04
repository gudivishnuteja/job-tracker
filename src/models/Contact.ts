import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ContactDoc extends Document {
  userId: Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  relation?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<ContactDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    company: { type: String },
    relation: { type: String },
  },
  { timestamps: true }
);

export const Contact = mongoose.model<ContactDoc>('Contact', contactSchema);
