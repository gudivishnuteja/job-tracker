import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { DocumentModel } from '../models/Document';

export async function listDocuments(req: Request, res: Response) {
  const userId = req.userId!;
  const docs = await DocumentModel.find({ userId: new Types.ObjectId(userId) }).sort({ updatedAt: -1 });
  return res.json({ documents: docs });
}

export async function createDocument(req: Request, res: Response) {
  const userId = req.userId!;
  const { type, version, url } = req.body as { type?: 'resume' | 'cover'; version?: string; url?: string };
  if (!type || !version || !url) return res.status(400).json({ message: 'Missing fields' });
  const doc = await DocumentModel.create({ userId: new Types.ObjectId(userId), type, version, url });
  return res.status(201).json({ document: doc });
}

export async function deleteDocument(req: Request, res: Response) {
  const userId = req.userId!;
  const { id } = req.params;
  const deleted = await DocumentModel.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) });
  if (!deleted) return res.status(404).json({ message: 'Document not found' });
  return res.status(204).send();
}
