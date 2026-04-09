require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connectDB = require('./db');

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:4200,http://localhost:3000').split(',');
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart',       require('./routes/cart'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/contact',    require('./routes/contact'));

app.get('/api/health', (req, res) => res.json({ success: true, message: '🌸 HerStyle API is running!' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('');
    console.log('🌸 ================================= 🌸');
    console.log(`   HerStyle API running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log('🌸 ================================= 🌸');
    console.log('');
  });
});
