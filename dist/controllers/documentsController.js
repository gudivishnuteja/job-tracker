"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDocuments = listDocuments;
exports.createDocument = createDocument;
exports.deleteDocument = deleteDocument;
const mongoose_1 = require("mongoose");
const Document_1 = require("../models/Document");
async function listDocuments(req, res) {
    const userId = req.userId;
    const docs = await Document_1.DocumentModel.find({ userId: new mongoose_1.Types.ObjectId(userId) }).sort({ updatedAt: -1 });
    return res.json({ documents: docs });
}
async function createDocument(req, res) {
    const userId = req.userId;
    const { type, version, url } = req.body;
    if (!type || !version || !url)
        return res.status(400).json({ message: 'Missing fields' });
    const doc = await Document_1.DocumentModel.create({ userId: new mongoose_1.Types.ObjectId(userId), type, version, url });
    return res.status(201).json({ document: doc });
}
async function deleteDocument(req, res) {
    const userId = req.userId;
    const { id } = req.params;
    const deleted = await Document_1.DocumentModel.findOneAndDelete({ _id: id, userId: new mongoose_1.Types.ObjectId(userId) });
    if (!deleted)
        return res.status(404).json({ message: 'Document not found' });
    return res.status(204).send();
}
