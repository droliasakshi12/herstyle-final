// src/environments/environment.ts
// ─── PASTE YOUR GOOGLE CLIENT ID BELOW ───────────────────────────────────────
const GOOGLE_CLIENT_ID = '580699194916-rrfik0ps0lnf08ldrrk4p1ek1u3fqg9l.apps.googleusercontent.com';
// ─────────────────────────────────────────────────────────────────────────────

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  googleClientId: GOOGLE_CLIENT_ID
};
