const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: generate JWT
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// ─── POST /api/auth/google ───────────────────────────────────────────────────
// Body: { credential: <Google ID token> }
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential required' });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture } = payload;

    // Upsert user
    let user = await User.findOne({ googleId });
    if (!user) {
      // Check if email already exists (linked to another login method)
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        user.picture  = picture || user.picture;
        user.lastLogin = new Date();
        await user.save();
      } else {
        // Brand-new user
        user = await User.create({ googleId, email, name, picture, role: 'user' });
      }
    } else {
      user.name      = name;
      user.picture   = picture || '';
      user.lastLogin = new Date();
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id:      user._id,
        email:   user.email,
        name:    user.name,
        picture: user.picture,
        role:    user.role,
      },
    });
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(401).json({ success: false, message: 'Google authentication failed' });
  }
});

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
router.get('/me', authMiddleware, (req, res) => {
  const u = req.user;
  res.json({
    success: true,
    user: {
      id:      u._id,
      email:   u.email,
      name:    u.name,
      picture: u.picture,
      role:    u.role,
    },
  });
});

// ─── POST /api/auth/logout ───────────────────────────────────────────────────
// Client should discard the token; this endpoint is for future revocation hooks.
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
