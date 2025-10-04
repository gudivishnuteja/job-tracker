"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listJobs = listJobs;
exports.createJob = createJob;
exports.updateJob = updateJob;
exports.deleteJob = deleteJob;
const mongoose_1 = require("mongoose");
const Job_1 = require("../models/Job");
async function listJobs(req, res) {
    const userId = req.userId;
    const { status, q, tags } = req.query;
    const filter = { userId: new mongoose_1.Types.ObjectId(userId) };
    if (status)
        filter.status = status;
    if (q) {
        filter.$or = [
            { title: { $regex: q, $options: 'i' } },
            { company: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } },
        ];
    }
    if (tags) {
        const arr = tags.split(',').map((t) => t.trim()).filter(Boolean);
        if (arr.length)
            filter.tags = { $all: arr };
    }
    const jobs = await Job_1.Job.find(filter).sort({ updatedAt: -1 }).lean();
    return res.json({ jobs });
}
async function createJob(req, res) {
    const userId = req.userId;
    const { title, company, location, status, tags, deadline, sourceLink, compensation } = req.body;
    if (!title || !company)
        return res.status(400).json({ message: 'Missing title or company' });
    const job = await Job_1.Job.create({
        userId: new mongoose_1.Types.ObjectId(userId),
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
async function updateJob(req, res) {
    const userId = req.userId;
    const { id } = req.params;
    const update = {};
    const allowed = ['title', 'company', 'location', 'status', 'tags', 'deadline', 'sourceLink', 'compensation'];
    for (const key of allowed) {
        if (key in req.body)
            update[key] = req.body[key];
    }
    if (update.deadline)
        update.deadline = new Date(String(update.deadline));
    const job = await Job_1.Job.findOneAndUpdate({ _id: id, userId: new mongoose_1.Types.ObjectId(userId) }, update, { new: true });
    if (!job)
        return res.status(404).json({ message: 'Job not found' });
    return res.json({ job });
}
async function deleteJob(req, res) {
    const userId = req.userId;
    const { id } = req.params;
    const job = await Job_1.Job.findOneAndDelete({ _id: id, userId: new mongoose_1.Types.ObjectId(userId) });
    if (!job)
        return res.status(404).json({ message: 'Job not found' });
    return res.status(204).send();
}
