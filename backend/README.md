# 🌸 HerStyle — Women's Fashion Store

A full-stack Angular + Node.js/Express + MongoDB fashion e-commerce app with Google OAuth login, role-based access (user vs admin), and new pages: About Us, Contact Us, Login.

---

## 📁 What's New

| File | Change |
|------|--------|
| `backend/models/User.js` | NEW — User model with googleId, role (user/admin) |
| `backend/middleware/auth.js` | NEW — JWT verification + adminGuard middleware |
| `backend/routes/auth.js` | NEW — `/api/auth/google`, `/me`, `/logout` |
| `backend/routes/contact.js` | NEW — Contact form API |
| `backend/server.js` | UPDATED — registers new routes |
| `backend/package.json` | UPDATED — added `jsonwebtoken`, `google-auth-library` |
| `backend/.env` | UPDATED — added Google & JWT config keys |
| `frontend/src/app/services/auth.service.ts` | NEW — Google OAuth + JWT session management |
| `frontend/src/app/guards/auth.guard.ts` | NEW — authGuard + adminGuard |
| `frontend/src/app/components/login/` | NEW — Login page with Google One Tap |
| `frontend/src/app/components/about/` | NEW — About Us page |
| `frontend/src/app/components/contact/` | NEW — Contact Us page |
| `frontend/src/app/components/navbar/` | UPDATED — conditional admin link, user avatar/menu |
| `frontend/src/app/app.routes.ts` | UPDATED — all new routes + guards |
| `frontend/src/environments/environment.ts` | UPDATED — added `googleClientId` field |

---

## ⚙️ Setup

### 1. Google Cloud Console

1. Go to https://console.cloud.google.com
2. **APIs & Services → Credentials → Create OAuth 2.0 Client ID** (Web application)
3. Authorized JavaScript origins: `http://localhost:4200`
4. Copy your **Client ID** and **Client Secret**

### 2. Backend

```bash
cd backend
npm install
```

Fill in `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/herstyle_db
PORT=3000
NODE_ENV=development

GOOGLE_CLIENT_ID=paste_your_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here

JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d

ALLOWED_ORIGINS=http://localhost:4200
```

```bash
node seed.js   # seed products (first time)
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
```

Open `src/environments/environment.ts` and set your Client ID:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID_HERE'  // ← paste here
};
```

```bash
npm start
```

---

## 🔐 How Auth Works

```
/login  →  Google button/One Tap
        →  Google returns signed credential token
        →  POST /api/auth/google { credential }
        →  Backend verifies with google-auth-library
        →  Upserts User in MongoDB (role: 'user' by default)
        →  Returns JWT + user object
        →  Frontend stores in localStorage
        →  Navbar shows avatar, conditional Admin link
```

### Granting Admin Access

```js
// In MongoDB shell / Compass
db.users.updateOne({ email: "you@gmail.com" }, { $set: { role: "admin" } })
```

After next login, the Admin panel link will appear.

---

## 🗺️ Routes

| Path | Access |
|------|--------|
| `/` | Public |
| `/products` | Public |
| `/products/:id` | Public |
| `/cart` | Public |
| `/wishlist` | Public |
| `/about` | Public |
| `/contact` | Public |
| `/login` | Public (redirects if already logged in) |
| `/admin` | 🔒 Logged-in Admin only |

---

## 🌐 New API Endpoints

```
POST   /api/auth/google           — Google sign-in (public)
GET    /api/auth/me               — Current user (Bearer token required)
POST   /api/auth/logout           — Logout (Bearer token required)

POST   /api/contact               — Submit contact form (public)
GET    /api/contact               — List submissions (admin token required)
PATCH  /api/contact/:id/status    — Mark read/replied (admin token required)
```
