import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Job, JobDoc, JobStatus } from '../models/Job';

export async function listJobs(req: Request, res: Response) {
  const userId = req.userId!;
  const { status, q, tags } = req.query as { status?: JobStatus; q?: string; tags?: string };

  const filter: any = { userId: new Types.ObjectId(userId) };
  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { company: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } },
    ];
  }
  if (tags) {
    const arr = tags.split(',').map((t) => t.trim()).filter(Boolean);
    if (arr.length) filter.tags = { $all: arr };
  }

  const jobs = await Job.find(filter).sort({ updatedAt: -1 }).lean<JobDoc[]>();
  return res.json({ jobs });
}

export async function createJob(req: Request, res: Response) {
  const userId = req.userId!;
  const { title, company, location, status, tags, deadline, sourceLink, compensation } = req.body as Partial<JobDoc> & { title?: string; company?: string };

  if (!title || !company) return res.status(400).json({ message: 'Missing title or company' });

  const job = await Job.create({
    userId: new Types.ObjectId(userId),
    title,
    company,
    location,
    status,
    tags: Array.isArray(tags) ? tags : tags ? [String(tags)] : [],
    deadline: deadline ? new Date(String(deadline)) : undefined,
    sourceLink,
    compensation,
  });

  return res.status(201).json({ job });
}

export async function updateJob(req: Request, res: Response) {
  const userId = req.userId!;
  const { id } = req.params;
  const update: any = {};
  const allowed = ['title', 'company', 'location', 'status', 'tags', 'deadline', 'sourceLink', 'compensation'];
  for (const key of allowed) {
    if (key in req.body) update[key] = req.body[key];
  }
  if (update.deadline) update.deadline = new Date(String(update.deadline));

  const job = await Job.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, update, { new: true });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  return res.json({ job });
}

export async function deleteJob(req: Request, res: Response) {
  const userId = req.userId!;
  const { id } = req.params;
  const job = await Job.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  return res.status(204).send();
}
