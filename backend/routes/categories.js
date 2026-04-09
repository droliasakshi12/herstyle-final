const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  try {
    const cats = await Category.find().sort({ name: 1 }).lean();
    const data = cats.map(c => ({ ...c, id: c._id }));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id).lean();
    if (!cat) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: { ...cat, id: cat._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.body.name) return res.status(400).json({ success: false, message: 'Name required' });
    const cat = await Category.create(req.body);
    res.status(201).json({ success: true, data: { ...cat.toObject(), id: cat._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    res.json({ success: true, data: { ...cat, id: cat._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
