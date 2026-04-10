import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: 'user' | 'admin';
}

const TOKEN_KEY = 'hs_token';
const USER_KEY  = 'hs_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<AuthUser | null>(this.loadUser());
  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly user    = this._user.asReadonly();
  readonly token   = this._token.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());
  readonly isAdmin    = computed(() => this._user()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {}

  /** Called from the login page after Google One Tap / button returns a credential */
  loginWithGoogle(credential: string): Promise<AuthUser> {
    return new Promise((resolve, reject) => {
      this.http
        .post<{ success: boolean; token: string; user: AuthUser }>(
          `${environment.apiUrl}/auth/google`,
          { credential }
        )
        .subscribe({
          next: (res) => {
            this.setSession(res.token, res.user);
            resolve(res.user);
          },
          error: (err) => reject(err),
        });
    });
  }

  /** Manual login with email and password (for Admin or testing) */
  login(email: string, password: string): Promise<AuthUser> {
    return new Promise((resolve, reject) => {
      this.http
        .post<{ success: boolean; token: string; user: AuthUser }>(
          `${environment.apiUrl}/auth/login`,
          { email, password }
        )
        .subscribe({
          next: (res) => {
            this.setSession(res.token, res.user);
            resolve(res.user);
          },
          error: (err) => reject(err),
        });
    });
  }

  logout() {
    // Optionally call backend logout endpoint
    const token = this._token();
    if (token) {
      this.http
        .post(`${environment.apiUrl}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe({ error: () => {} });
    }
    this.clearSession();
    this.router.navigate(['/login']);
  }

  getAuthHeader(): { Authorization: string } | {} {
    const t = this._token();
    return t ? { Authorization: `Bearer ${t}` } : {};
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private setSession(token: string, user: AuthUser) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._token.set(token);
    this._user.set(user);
  }

  private clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._user.set(null);
  }

  private loadUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
