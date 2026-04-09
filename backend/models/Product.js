const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  description:    { type: String, default: '' },
  price:          { type: Number, required: true },
  original_price: { type: Number, default: null },
  category_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  category_name:  { type: String, default: '' },
  image_url:      { type: String, default: '' },
  sizes:          { type: String, default: 'XS,S,M,L,XL' },
  colors:         { type: String, default: '' },
  stock:          { type: Number, default: 100 },
  is_featured:    { type: Boolean, default: false },
  is_new:         { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
