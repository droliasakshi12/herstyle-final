const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Simple Contact schema (inline)
const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status:  { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

// ─── POST /api/contact ───────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully', id: contact._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/contact (admin only) ──────────────────────────────────────────
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts, count: contacts.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PATCH /api/contact/:id/status (admin only) ─────────────────────────────
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
