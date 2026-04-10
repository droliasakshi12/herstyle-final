const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');

// GET all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    const data = orders.map(o => ({ ...o, id: o._id }));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET user's own orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ customer_email: req.user.email }).sort({ createdAt: -1 }).lean();
    const data = orders.map(o => ({ ...o, id: o._id }));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET order tracking by ID (public — for customers to track their order)
router.get('/track/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let order;

    // 1. Try finding by full MongoDB ID if valid
    if (id.length === 24 && /^[0-9a-fA-F]+$/.test(id)) {
      order = await Order.findById(id);
    }

    // 2. Fallback: Search by short ID (match beginning of _id string)
    if (!order) {
      // We convert the hex ID to string and check if it starts with the provided ID
      const allOrders = await Order.find({});
      order = allOrders.find(o => o._id.toString().toUpperCase().startsWith(id.toUpperCase()));
    }

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during tracking' });
  }
});

// GET single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: { ...order, id: order._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST place order
router.post('/', async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, shipping_address, items, total_amount } = req.body;
    if (!customer_name || !customer_email || !shipping_address) {
      return res.status(400).json({ success: false, message: 'Name, email and address are required' });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one item required' });
    }

    // Enrich items with product names
    const enrichedItems = await Promise.all(items.map(async item => {
      const product = await Product.findById(item.product_id).lean();
      return { ...item, name: product ? product.name : '' };
    }));

    const order = await Order.create({
      customer_name, customer_email,
      customer_phone: customer_phone || '',
      shipping_address, total_amount,
      items: enrichedItems,
      statusHistory: [{ status: 'pending', updatedAt: new Date() }]
    });

    res.status(201).json({ success: true, message: 'Order placed!', orderId: order._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update order status
router.put('/:id/status', async (req, res) => {
  try {
    const valid = ['pending','processing','shipped','delivered','cancelled'];
    if (!valid.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
      $push: { statusHistory: { status: req.body.status, updatedAt: new Date() } }
    });
    res.json({ success: true, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
