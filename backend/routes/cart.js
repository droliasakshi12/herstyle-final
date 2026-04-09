const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET cart by session — MUST be before /:id routes
router.get('/session/:sessionId', async (req, res) => {
  try {
    const items = await Cart.find({ session_id: req.params.sessionId }).populate('product_id').lean();
    const data = items.map(i => {
      const p = i.product_id || {};
      return {
        id: i._id,
        product_id: p._id || i.product_id,
        name: p.name || '',
        price: p.price || 0,
        image_url: p.image_url || '',
        stock: p.stock || 0,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
      };
    });
    const total = data.reduce((s, i) => s + (i.price * i.quantity), 0);
    res.json({ success: true, data, total: total.toFixed(2) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Keep legacy route too for backwards compat
router.get('/:sessionId', async (req, res) => {
  try {
    const items = await Cart.find({ session_id: req.params.sessionId }).populate('product_id').lean();
    const data = items.map(i => {
      const p = i.product_id || {};
      return {
        id: i._id,
        product_id: p._id || i.product_id,
        name: p.name || '',
        price: p.price || 0,
        image_url: p.image_url || '',
        stock: p.stock || 0,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
      };
    });
    const total = data.reduce((s, i) => s + (i.price * i.quantity), 0);
    res.json({ success: true, data, total: total.toFixed(2) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add to cart
router.post('/', async (req, res) => {
  try {
    const { product_id, quantity = 1, size = 'M', color = '', session_id } = req.body;
    if (!product_id || !session_id) {
      return res.status(400).json({ success: false, message: 'product_id and session_id required' });
    }

    // Validate product exists
    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // If already in cart same product+size+session, increase qty
    const existing = await Cart.findOne({ product_id, session_id, size });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json({ success: true, message: 'Cart updated' });
    }

    await Cart.create({ product_id, quantity, size, color, session_id });
    res.status(201).json({ success: true, message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update quantity
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ success: false, message: 'Valid quantity required' });
    await Cart.findByIdAndUpdate(req.params.id, { quantity });
    res.json({ success: true, message: 'Updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE single cart item
router.delete('/item/:id', async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE clear entire cart by session
router.delete('/clear/:sessionId', async (req, res) => {
  try {
    await Cart.deleteMany({ session_id: req.params.sessionId });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE by item id (fallback)
router.delete('/:id', async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
