import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Job } from '../models/Job';
import { Application } from '../models/Application';

export async function getAnalytics(req: Request, res: Response) {
  const userId = req.userId!;
  const userObjId = new Types.ObjectId(userId);

  const statusCounts = await Job.aggregate([
    { $match: { userId: userObjId } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const appsPerWeek = await Application.aggregate([
    { $lookup: { from: 'jobs', localField: 'jobId', foreignField: '_id', as: 'job' } },
    { $unwind: '$job' },
    { $match: { 'job.userId': userObjId, appliedOn: { $ne: null } } },
    { $group: { _id: { $dateTrunc: { date: '$appliedOn', unit: 'week' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  return res.json({ statusCounts, appsPerWeek });
}
