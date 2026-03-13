const Note = require('../models/Note');

exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await Note.create({
            title: title || 'Untitled',
            content: content || [],
            user: req.user.id, // Assuming user is populated by protect middleware
        });

        res.status(201).json({
            status: 'success',
            data: { note },
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }).sort('-updatedAt');

        res.status(200).json({
            status: 'success',
            results: notes.length,
            data: { notes },
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getNote = async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user.id });

        if (!note) {
            return res.status(404).json({ status: 'fail', message: 'Note not found.' });
        }

        res.status(200).json({
            status: 'success',
            data: { note },
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, content },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({ status: 'fail', message: 'Note not found.' });
        }

        res.status(200).json({
            status: 'success',
            data: { note },
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!note) {
            return res.status(404).json({ status: 'fail', message: 'Note not found.' });
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
