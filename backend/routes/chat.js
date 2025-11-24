const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// All routes are protected
router.use(authMiddleware);

// @route   GET /api/chat/history
// @desc    Get all conversations for current user
// @access  Private
router.get('/history', async (req, res) => {
    try {
        const [conversations] = await db.query(
            'SELECT id, title, created_at, updated_at FROM chat_history WHERE user_id = ? ORDER BY updated_at DESC',
            [req.user.userId]
        );

        res.json(conversations);
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/chat/history/:id
// @desc    Get specific conversation
// @access  Private
router.get('/history/:id', async (req, res) => {
    try {
        const [conversations] = await db.query(
            'SELECT * FROM chat_history WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.userId]
        );

        if (conversations.length === 0) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Parse JSON messages
        const conversation = conversations[0];
        conversation.messages = JSON.parse(conversation.messages);

        res.json(conversation);
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/chat/history
// @desc    Create new conversation
// @access  Private
router.post('/history', async (req, res) => {
    const { title, messages } = req.body;

    if (!title || !messages) {
        return res.status(400).json({ message: 'Title and messages are required' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO chat_history (user_id, title, messages) VALUES (?, ?, ?)',
            [req.user.userId, title, JSON.stringify(messages)]
        );

        res.status(201).json({
            id: result.insertId,
            title,
            messages,
            created_at: new Date(),
            updated_at: new Date()
        });
    } catch (error) {
        console.error('Create conversation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/chat/history/:id
// @desc    Update conversation
// @access  Private
router.put('/history/:id', async (req, res) => {
    const { title, messages } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE chat_history SET title = ?, messages = ? WHERE id = ? AND user_id = ?',
            [title, JSON.stringify(messages), req.params.id, req.user.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.json({ message: 'Conversation updated successfully' });
    } catch (error) {
        console.error('Update conversation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/chat/history/:id
// @desc    Delete conversation
// @access  Private
router.delete('/history/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM chat_history WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('Delete conversation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
