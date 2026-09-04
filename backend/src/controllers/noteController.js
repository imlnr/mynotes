const Note = require('../models/Note');
const asyncHandler = require('../utils/asyncHandler');
const { generateShareId } = require('../utils/shareId');

const sendNote = (res, note, statusCode = 200) => {
    res.status(statusCode).json({
        status: 'success',
        data: { note },
    });
};

exports.createNote = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const note = await Note.create({
        title: title || 'Untitled',
        content: content || [],
        user: req.user.id,
    });

    sendNote(res, note, 201);
});

exports.getAllNotes = asyncHandler(async (req, res) => {
    const { archived } = req.query;
    const filter = { user: req.user.id };

    if (archived === 'true') {
        filter.isArchived = true;
    } else if (archived !== 'all') {
        filter.isArchived = false;
    }

    const notes = await Note.find(filter).sort('-updatedAt');

    res.status(200).json({
        status: 'success',
        results: notes.length,
        data: { notes },
    });
});

exports.getNote = asyncHandler(async (req, res) => {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });

    if (!note) {
        return res.status(404).json({ status: 'fail', message: 'Note not found.' });
    }

    sendNote(res, note);
});

exports.getSharedNote = asyncHandler(async (req, res) => {
    const note = await Note.findOne({
        shareId: req.params.shareId,
        isPublished: true,
    }).select('title content updatedAt publishedAt shareId');

    if (!note) {
        return res.status(404).json({ status: 'fail', message: 'Shared note not found.' });
    }

    sendNote(res, note);
});

exports.updateNote = asyncHandler(async (req, res) => {
    const allowed = ['title', 'content', 'isArchived', 'isPublished'];
    const updates = {};

    for (const key of allowed) {
        if (req.body[key] !== undefined) {
            updates[key] = req.body[key];
        }
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ status: 'fail', message: 'No valid fields to update.' });
    }

    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });

    if (!note) {
        return res.status(404).json({ status: 'fail', message: 'Note not found.' });
    }

    if (updates.isPublished === true) {
        if (!note.shareId) {
            updates.shareId = generateShareId();
        }
        updates.publishedAt = new Date();
    }

    if (updates.isPublished === false) {
        updates.publishedAt = null;
    }

    Object.assign(note, updates);
    await note.save();

    sendNote(res, note);
});

exports.deleteNote = asyncHandler(async (req, res) => {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!note) {
        return res.status(404).json({ status: 'fail', message: 'Note not found.' });
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
