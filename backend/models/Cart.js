const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:   { type: Number, default: 1 },
  size:       { type: String, default: 'M' },
  color:      { type: String, default: '' },
  session_id: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
