"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = getAnalytics;
const mongoose_1 = require("mongoose");
const Job_1 = require("../models/Job");
const Application_1 = require("../models/Application");
async function getAnalytics(req, res) {
    const userId = req.userId;
    const userObjId = new mongoose_1.Types.ObjectId(userId);
    const statusCounts = await Job_1.Job.aggregate([
        { $match: { userId: userObjId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const appsPerWeek = await Application_1.Application.aggregate([
        { $lookup: { from: 'jobs', localField: 'jobId', foreignField: '_id', as: 'job' } },
        { $unwind: '$job' },
        { $match: { 'job.userId': userObjId, appliedOn: { $ne: null } } },
        { $group: { _id: { $dateTrunc: { date: '$appliedOn', unit: 'week' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);
    return res.json({ statusCounts, appsPerWeek });
}
