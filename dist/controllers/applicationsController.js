"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listApplications = listApplications;
exports.createApplication = createApplication;
exports.updateApplication = updateApplication;
const mongoose_1 = require("mongoose");
const Application_1 = require("../models/Application");
const Job_1 = require("../models/Job");
async function listApplications(req, res) {
    const userId = req.userId;
    const { jobId } = req.query;
    let jobIds;
    if (jobId) {
        const job = await Job_1.Job.findOne({ _id: jobId, userId: new mongoose_1.Types.ObjectId(userId) }).select('_id');
        if (!job)
            return res.status(404).json({ message: 'Job not found' });
        jobIds = [job._id];
    }
    else {
        const jobs = await Job_1.Job.find({ userId: new mongoose_1.Types.ObjectId(userId) }).select('_id');
        jobIds = jobs.map((j) => j._id);
    }
    const applications = await Application_1.Application.find({ jobId: { $in: jobIds } }).sort({ updatedAt: -1 });
    return res.json({ applications });
}
async function createApplication(req, res) {
    const userId = req.userId;
    const { jobId, resumeVersionId, appliedOn, notes } = req.body;
    if (!jobId)
        return res.status(400).json({ message: 'Missing jobId' });
    const job = await Job_1.Job.findOne({ _id: jobId, userId: new mongoose_1.Types.ObjectId(userId) }).select('_id');
    if (!job)
        return res.status(404).json({ message: 'Job not found' });
    const application = await Application_1.Application.create({
        jobId: job._id,
        resumeVersionId: resumeVersionId ? new mongoose_1.Types.ObjectId(resumeVersionId) : undefined,
        appliedOn: appliedOn ? new Date(String(appliedOn)) : undefined,
        notes,
    });
    return res.status(201).json({ application });
}
async function updateApplication(req, res) {
    const userId = req.userId;
    const { id } = req.params;
    const application = await Application_1.Application.findById(id);
    if (!application)
        return res.status(404).json({ message: 'Application not found' });
    const job = await Job_1.Job.findOne({ _id: application.jobId, userId: new mongoose_1.Types.ObjectId(userId) }).select('_id');
    if (!job)
        return res.status(403).json({ message: 'Forbidden' });
    const update = {};
    const allowed = ['resumeVersionId', 'appliedOn', 'notes'];
    for (const key of allowed)
        if (key in req.body)
            update[key] = req.body[key];
    if (update.resumeVersionId)
        update.resumeVersionId = new mongoose_1.Types.ObjectId(String(update.resumeVersionId));
    if (update.appliedOn)
        update.appliedOn = new Date(String(update.appliedOn));
    const updated = await Application_1.Application.findByIdAndUpdate(id, update, { new: true });
    return res.json({ application: updated });
}
