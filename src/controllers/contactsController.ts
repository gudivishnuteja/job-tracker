import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Contact } from '../models/Contact';

export async function listContacts(req: Request, res: Response) {
  const userId = req.userId!;
  const contacts = await Contact.find({ userId: new Types.ObjectId(userId) }).sort({ name: 1 });
  return res.json({ contacts });
}

export async function createContact(req: Request, res: Response) {
  const userId = req.userId!;
  const { name, email, phone, company, relation } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    relation?: string;
  };
  if (!name) return res.status(400).json({ message: 'Missing name' });
  const contact = await Contact.create({ userId: new Types.ObjectId(userId), name, email, phone, company, relation });
  return res.status(201).json({ contact });
}

export async function updateContact(req: Request, res: Response) {
  const userId = req.userId!;
  const { id } = req.params;
  const update: any = {};
  for (const k of ['name', 'email', 'phone', 'company', 'relation']) if (k in req.body) update[k] = req.body[k];
  const updated = await Contact.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, update, { new: true });
  if (!updated) return res.status(404).json({ message: 'Contact not found' });
  return res.json({ contact: updated });
}
