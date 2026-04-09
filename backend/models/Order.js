const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer_name:    { type: String, required: true },
  customer_email:   { type: String, required: true },
  customer_phone:   { type: String, default: '' },
  shipping_address: { type: String, required: true },
  total_amount:     { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending','processing','shipped','delivered','cancelled'],
    default: 'pending'
  },
  items: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:       String,
    quantity:   Number,
    size:       String,
    color:      String,
    price:      Number,
  }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
