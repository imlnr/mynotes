const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled',
    },
    content: {
        type: mongoose.Schema.Types.Mixed, // Use Mixed for flexible block JSON
        default: [],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Note must belong to a user.'],
    },
}, {
    timestamps: true,
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
