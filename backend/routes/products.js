const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// GET all products (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, featured, new: isNew, search, limit = 50 } = req.query;
    const query = {};

    if (category)           query.category_id = category;
    if (featured === 'true') query.is_featured = true;
    if (isNew === 'true')    query.is_new = true;
    if (search)              query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

    // Map _id to id for frontend compatibility
    const data = products.map(p => ({ ...p, id: p._id }));
    res.json({ success: true, data, count: data.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: { ...product, id: product._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create product
router.post('/', async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) return res.status(400).json({ success: false, message: 'Name and price are required' });

    // If category_id provided, fetch category name
    let category_name = req.body.category_name || '';
    if (req.body.category_id) {
      const cat = await Category.findById(req.body.category_id);
      if (cat) category_name = cat.name;
    }

    const product = await Product.create({ ...req.body, category_name });
    res.status(201).json({ success: true, data: { ...product.toObject(), id: product._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    let category_name = req.body.category_name || '';
    if (req.body.category_id) {
      const cat = await Category.findById(req.body.category_id);
      if (cat) category_name = cat.name;
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, category_name },
      { new: true }
    ).lean();
    res.json({ success: true, data: { ...product, id: product._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
