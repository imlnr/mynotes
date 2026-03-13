const express = require('express');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middlewares/authMiddleware'); // Fixed path pluralization

const router = express.Router();

// All note routes should be protected
router.use(authMiddleware.protect);

router
    .route('/')
    .get(noteController.getAllNotes)
    .post(noteController.createNote);

router
    .route('/:id')
    .get(noteController.getNote)
    .patch(noteController.updateNote)
    .delete(noteController.deleteNote);

module.exports = router;
