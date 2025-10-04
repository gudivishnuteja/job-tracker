import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Reminder } from '../models/Reminder';
import { Job } from '../models/Job';
import { generateIcs } from '../utils/ics';

export async function listReminders(req: Request, res: Response) {
  const userId = req.userId!;
  const { jobId, dueAfter, dueBefore } = req.query as { jobId?: string; dueAfter?: string; dueBefore?: string };

  const filter: any = {};
  if (jobId) {
    const job = await Job.findOne({ _id: jobId, userId: new Types.ObjectId(userId) }).select('_id');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    filter.jobId = job._id;
  } else {
    const jobs = await Job.find({ userId: new Types.ObjectId(userId) }).select('_id');
    filter.jobId = { $in: jobs.map((j) => j._id) };
  }
  if (dueAfter || dueBefore) {
    filter.dueAt = {} as any;
    if (dueAfter) filter.dueAt.$gte = new Date(dueAfter);
    if (dueBefore) filter.dueAt.$lte = new Date(dueBefore);
  }

  const reminders = await Reminder.find(filter).sort({ dueAt: 1 });
  return res.json({ reminders });
}

export async function createReminder(req: Request, res: Response) {
  const userId = req.userId!;
  const { jobId, type, dueAt, note } = req.body as { jobId?: string; type?: 'deadline' | 'interview'; dueAt?: string | Date; note?: string };

  if (!jobId || !type || !dueAt) return res.status(400).json({ message: 'Missing fields' });
  const job = await Job.findOne({ _id: jobId, userId: new Types.ObjectId(userId) }).select('_id');
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const reminder = await Reminder.create({ jobId: job._id, type, dueAt: new Date(String(dueAt)), note });
  return res.status(201).json({ reminder });
}

export async function updateReminder(req: Request, res: Response) {
  const userId = req.userId!;
  const { id } = req.params;

  const reminder = await Reminder.findById(id);
  if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

  const job = await Job.findOne({ _id: reminder.jobId, userId: new Types.ObjectId(userId) }).select('_id');
  if (!job) return res.status(403).json({ message: 'Forbidden' });

  const update: any = {};
  const allowed = ['type', 'dueAt', 'note'];
  for (const key of allowed) if (key in req.body) update[key] = req.body[key];
  if (update.dueAt) update.dueAt = new Date(String(update.dueAt));

  const updated = await Reminder.findByIdAndUpdate(id, update, { new: true });
  return res.json({ reminder: updated });
}

export async function exportIcs(req: Request, res: Response) {
  const userId = req.userId!;
  const jobs = await Job.find({ userId: new Types.ObjectId(userId) }).select('_id title company sourceLink');
  const jobMap = new Map(jobs.map((j) => [String(j._id), j]));

  const reminders = await Reminder.find({ jobId: { $in: jobs.map((j) => j._id) } }).sort({ dueAt: 1 }).lean();
  const icsText = generateIcs(reminders, jobMap);

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="reminders.ics"');
  return res.send(icsText);
}
