const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled',
        trim: true,
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        default: [],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Note must belong to a user.'],
        index: true,
    },
    isArchived: {
        type: Boolean,
        default: false,
        index: true,
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
    },
    shareId: {
        type: String,
        unique: true,
        sparse: true,
        index: true,
    },
    publishedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
