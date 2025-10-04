import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Application } from '../models/Application';
import { Job } from '../models/Job';

export async function listApplications(req: Request, res: Response) {
  const userId = req.userId!;
  const { jobId } = req.query as { jobId?: string };

  let jobIds: Types.ObjectId[];
  if (jobId) {
    const job = await Job.findOne({ _id: jobId, userId: new Types.ObjectId(userId) }).select('_id');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    jobIds = [job._id as unknown as Types.ObjectId];
  } else {
    const jobs = await Job.find({ userId: new Types.ObjectId(userId) }).select('_id');
    jobIds = jobs.map((j) => j._id as unknown as Types.ObjectId);
  }

  const applications = await Application.find({ jobId: { $in: jobIds } }).sort({ updatedAt: -1 });
  return res.json({ applications });
}

export async function createApplication(req: Request, res: Response) {
  const userId = req.userId!;
  const { jobId, resumeVersionId, appliedOn, notes } = req.body as {
    jobId?: string;
    resumeVersionId?: string;
    appliedOn?: string | Date;
    notes?: string;
  };
  if (!jobId) return res.status(400).json({ message: 'Missing jobId' });

  const job = await Job.findOne({ _id: jobId, userId: new Types.ObjectId(userId) }).select('_id');
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const application = await Application.create({
    jobId: job._id,
    resumeVersionId: resumeVersionId ? new Types.ObjectId(resumeVersionId) : undefined,
    appliedOn: appliedOn ? new Date(String(appliedOn)) : undefined,
    notes,
  });
  return res.status(201).json({ application });
}

export async function updateApplication(req: Request, res: Response) {
  const userId = req.userId!;
  const { id } = req.params;

  const application = await Application.findById(id);
  if (!application) return res.status(404).json({ message: 'Application not found' });

  const job = await Job.findOne({ _id: application.jobId, userId: new Types.ObjectId(userId) }).select('_id');
  if (!job) return res.status(403).json({ message: 'Forbidden' });

  const update: any = {};
  const allowed = ['resumeVersionId', 'appliedOn', 'notes'];
  for (const key of allowed) if (key in req.body) update[key] = req.body[key];
  if (update.resumeVersionId) update.resumeVersionId = new Types.ObjectId(String(update.resumeVersionId));
  if (update.appliedOn) update.appliedOn = new Date(String(update.appliedOn));

  const updated = await Application.findByIdAndUpdate(id, update, { new: true });
  return res.json({ application: updated });
}
