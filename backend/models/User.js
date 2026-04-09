const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId:    { type: String, unique: true, sparse: true },
  email:       { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  picture:     { type: String, default: '' },
  role:        { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive:    { type: Boolean, default: true },
  lastLogin:   { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
