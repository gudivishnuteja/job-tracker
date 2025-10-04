"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listReminders = listReminders;
exports.createReminder = createReminder;
exports.updateReminder = updateReminder;
exports.exportIcs = exportIcs;
const mongoose_1 = require("mongoose");
const Reminder_1 = require("../models/Reminder");
const Job_1 = require("../models/Job");
const ics_1 = require("../utils/ics");
async function listReminders(req, res) {
    const userId = req.userId;
    const { jobId, dueAfter, dueBefore } = req.query;
    const filter = {};
    if (jobId) {
        const job = await Job_1.Job.findOne({ _id: jobId, userId: new mongoose_1.Types.ObjectId(userId) }).select('_id');
        if (!job)
            return res.status(404).json({ message: 'Job not found' });
        filter.jobId = job._id;
    }
    else {
        const jobs = await Job_1.Job.find({ userId: new mongoose_1.Types.ObjectId(userId) }).select('_id');
        filter.jobId = { $in: jobs.map((j) => j._id) };
    }
    if (dueAfter || dueBefore) {
        filter.dueAt = {};
        if (dueAfter)
            filter.dueAt.$gte = new Date(dueAfter);
        if (dueBefore)
            filter.dueAt.$lte = new Date(dueBefore);
    }
    const reminders = await Reminder_1.Reminder.find(filter).sort({ dueAt: 1 });
    return res.json({ reminders });
}
async function createReminder(req, res) {
    const userId = req.userId;
    const { jobId, type, dueAt, note } = req.body;
    if (!jobId || !type || !dueAt)
        return res.status(400).json({ message: 'Missing fields' });
    const job = await Job_1.Job.findOne({ _id: jobId, userId: new mongoose_1.Types.ObjectId(userId) }).select('_id');
    if (!job)
        return res.status(404).json({ message: 'Job not found' });
    const reminder = await Reminder_1.Reminder.create({ jobId: job._id, type, dueAt: new Date(String(dueAt)), note });
    return res.status(201).json({ reminder });
}
async function updateReminder(req, res) {
    const userId = req.userId;
    const { id } = req.params;
    const reminder = await Reminder_1.Reminder.findById(id);
    if (!reminder)
        return res.status(404).json({ message: 'Reminder not found' });
    const job = await Job_1.Job.findOne({ _id: reminder.jobId, userId: new mongoose_1.Types.ObjectId(userId) }).select('_id');
    if (!job)
        return res.status(403).json({ message: 'Forbidden' });
    const update = {};
    const allowed = ['type', 'dueAt', 'note'];
    for (const key of allowed)
        if (key in req.body)
            update[key] = req.body[key];
    if (update.dueAt)
        update.dueAt = new Date(String(update.dueAt));
    const updated = await Reminder_1.Reminder.findByIdAndUpdate(id, update, { new: true });
    return res.json({ reminder: updated });
}
async function exportIcs(req, res) {
    const userId = req.userId;
    const jobs = await Job_1.Job.find({ userId: new mongoose_1.Types.ObjectId(userId) }).select('_id title company sourceLink');
    const jobMap = new Map(jobs.map((j) => [String(j._id), j]));
    const reminders = await Reminder_1.Reminder.find({ jobId: { $in: jobs.map((j) => j._id) } }).sort({ dueAt: 1 }).lean();
    const icsText = (0, ics_1.generateIcs)(reminders, jobMap);
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="reminders.ics"');
    return res.send(icsText);
}
