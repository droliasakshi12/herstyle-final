require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function adjustAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin', salt);
  
  // Find the admin user and update the password
  const result = await User.findOneAndUpdate(
    { email: 'admin@herstyle.com' },
    { password: hashedPassword },
    { new: true }
  );

  console.log('✅ Admin password successfully changed to "admin"');
  await mongoose.disconnect();
}

adjustAdmin().catch(console.dir);
