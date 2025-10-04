"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listContacts = listContacts;
exports.createContact = createContact;
exports.updateContact = updateContact;
const mongoose_1 = require("mongoose");
const Contact_1 = require("../models/Contact");
async function listContacts(req, res) {
    const userId = req.userId;
    const contacts = await Contact_1.Contact.find({ userId: new mongoose_1.Types.ObjectId(userId) }).sort({ name: 1 });
    return res.json({ contacts });
}
async function createContact(req, res) {
    const userId = req.userId;
    const { name, email, phone, company, relation } = req.body;
    if (!name)
        return res.status(400).json({ message: 'Missing name' });
    const contact = await Contact_1.Contact.create({ userId: new mongoose_1.Types.ObjectId(userId), name, email, phone, company, relation });
    return res.status(201).json({ contact });
}
async function updateContact(req, res) {
    const userId = req.userId;
    const { id } = req.params;
    const update = {};
    for (const k of ['name', 'email', 'phone', 'company', 'relation'])
        if (k in req.body)
            update[k] = req.body[k];
    const updated = await Contact_1.Contact.findOneAndUpdate({ _id: id, userId: new mongoose_1.Types.ObjectId(userId) }, update, { new: true });
    if (!updated)
        return res.status(404).json({ message: 'Contact not found' });
    return res.json({ contact: updated });
}
