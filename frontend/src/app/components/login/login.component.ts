import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-brand">
          <img src="/logo.png" alt="HerStyle" class="login-logo" />
        </div>
        <h1 class="login-title">Welcome Back</h1>
        <p class="login-sub">Sign in to access your account, wishlist & orders</p>

        @if (error) {
          <div class="error-banner">{{ error }}</div>
        }
        @if (loading) {
          <div class="loading-row"><div class="spinner"></div><span>Signing you in…</span></div>
        }

        <div class="google-btn-wrap" [style.display]="showAdminLogin ? 'none' : 'flex'">
          <div id="google-btn"></div>
        </div>

        @if (showAdminLogin) {
          <form class="admin-login-form" (ngSubmit)="handleAdminLogin()">
            <div class="form-group">
              <label>Admin Email</label>
              <input type="email" name="email" [(ngModel)]="adminEmail" required placeholder="admin@herstyle.com" />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" name="password" [(ngModel)]="adminPassword" required placeholder="admin123" />
            </div>
            <button type="submit" class="btn-submit" [disabled]="loading || !adminEmail || !adminPassword">
              {{ loading ? 'Signing in...' : 'Sign In as Admin' }}
            </button>
          </form>
        }

        <p class="login-footer">
          @if (!showAdminLogin) { <a href="javascript:void(0)" (click)="showAdminLogin = true">Admin Login</a><br><br> }
          @if (showAdminLogin) { <a href="javascript:void(0)" (click)="showAdminLogin = false">← Back to Google Sign In</a><br><br> }
          By signing in you agree to our <a routerLink="/about">Terms</a> &amp; <a routerLink="/about">Privacy Policy</a>
        </p>
      </div>

      <div class="login-bg">
        <div class="login-bg-pattern"></div>
        <div class="login-bg-text">
          <span class="ornament">✦</span>
          <h2>Fashion made<br><em>for her.</em></h2>
          <p>500+ curated styles for the modern Indian woman.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { --brown:#8B6847; --brown-dark:#6B4F33; --beige:#F5EFE6; --ink:#4A3728; --beige-border:#E8DDD0; }
    .login-page { display:flex; min-height:100vh; background:#FFFCF8; }
    .login-card { flex:0 0 480px; max-width:480px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 48px; gap:16px; }
    .login-logo { height:64px; width:auto; object-fit:contain; }
    .login-brand { margin-bottom:8px; }
    .login-title { font-family:'Cormorant Garamond',Georgia,serif; font-size:2rem; color:var(--ink); margin:0; font-weight:600; }
    .login-sub { color:#9e8e80; font-size:0.9rem; margin:0 0 8px; text-align:center; max-width:320px; }
    .error-banner { background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:10px 16px; border-radius:8px; font-size:0.85rem; width:100%; text-align:center; }
    .loading-row { display:flex; align-items:center; gap:10px; color:var(--brown); font-size:0.9rem; }
    .spinner { width:20px; height:20px; border:2px solid var(--beige-border); border-top-color:var(--brown); border-radius:50%; animation:spin .7s linear infinite; }
    @keyframes spin { to { transform:rotate(360deg); } }
    .google-btn-wrap { min-height:44px; display:flex; align-items:center; justify-content:center; }
    .login-divider { color:#c9b8a8; font-size:0.8rem; margin:0; position:relative; width:100%; text-align:center; }
    .login-divider::before,.login-divider::after { content:''; position:absolute; top:50%; width:38%; height:1px; background:var(--beige-border); }
    .login-divider::before { left:0; } .login-divider::after { right:0; }
    .google-manual-btn { display:flex; align-items:center; gap:12px; width:100%; padding:12px 24px; border:1.5px solid var(--beige-border); border-radius:10px; background:white; color:var(--ink); font-size:0.95rem; font-weight:500; cursor:pointer; transition:all .2s; font-family:inherit; }
    .google-manual-btn:hover:not(:disabled) { border-color:var(--brown); background:var(--beige); }
    .google-manual-btn:disabled { opacity:.6; cursor:not-allowed; }
    .login-footer { font-size:0.8rem; color:#b0a090; text-align:center; margin:8px 0 0; }
    .login-footer a { color:var(--brown); text-decoration:none; }
    .login-footer a:hover { text-decoration:underline; }
    .login-bg { flex:1; background:linear-gradient(135deg,#f9f2e8 0%,#ede0ce 100%); display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
    .login-bg-pattern { position:absolute; inset:0; background-image:repeating-linear-gradient(45deg,rgba(139,104,71,.04) 0 1px,transparent 1px 40px); }
    .login-bg-text { position:relative; text-align:center; padding:40px; }
    .ornament { font-size:1.5rem; color:var(--brown); display:block; margin-bottom:16px; }
    .login-bg-text h2 { font-family:'Cormorant Garamond',Georgia,serif; font-size:3rem; color:var(--ink); font-weight:600; line-height:1.2; margin:0 0 16px; }
    .login-bg-text h2 em { font-style:italic; color:var(--brown); }
    .login-bg-text p { color:#8a7060; font-size:1rem; }
    .admin-login-form { width:100%; display:flex; flex-direction:column; gap:14px; }
    .form-group { display:flex; flex-direction:column; gap:4px; text-align:left; }
    .form-group label { font-size:0.8rem; font-weight:600; color:#555; }
    .form-group input { padding:10px 14px; border:1.5px solid var(--beige-border); border-radius:8px; font-size:0.9rem; outline:none; font-family:'Jost',sans-serif; transition:all 0.2s; }
    .form-group input:focus { border-color:var(--brown); }
    .btn-submit { padding:12px; background:var(--brown); color:white; border:none; border-radius:8px; font-weight:600; font-size:0.95rem; cursor:pointer; font-family:'Jost',sans-serif; transition:background 0.2s; }
    .btn-submit:hover:not(:disabled) { background:var(--brown-dark); }
    .btn-submit:disabled { opacity:0.6; cursor:not-allowed; }
    @media(max-width:768px) {
      .login-bg { display:none; }
      .login-card { flex:1; max-width:100%; padding:40px 24px; }
    }
  `]
})
export class LoginComponent implements OnInit, AfterViewInit {
  loading = false;
  error = '';
  showAdminLogin = false;
  adminEmail = '';
  adminPassword = '';

  constructor(private auth: AuthService, private router: Router, private ngZone: NgZone) { }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngAfterViewInit() {
    this.loadGoogleScript().then(() => this.initGoogleButton());
  }

  promptGoogle() {
    if (typeof google !== 'undefined') {
      google.accounts.id.prompt();
    }
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve) => {
      if (document.getElementById('google-gsi-script')) { resolve(); return; }
      const s = document.createElement('script');
      s.id = 'google-gsi-script';
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true; s.defer = true;
      s.onload = () => resolve();
      document.head.appendChild(s);
    });
  }

  private initGoogleButton() {
    if (typeof google === 'undefined') return;
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: { credential: string }) => {
        this.ngZone.run(() => this.handleCredential(response.credential));
      },
      auto_select: false,
    });
    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'outline', size: 'large', width: 320, text: 'signin_with' }
    );
  }

  private async handleCredential(credential: string) {
    this.loading = true;
    this.error = '';
    try {
      const user = await this.auth.loginWithGoogle(credential);
      const dest = user.role === 'admin' ? '/admin' : '/';
      this.router.navigate([dest]);
    } catch (err: any) {
      this.error = err?.error?.message || 'Sign-in failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async handleAdminLogin() {
    if (!this.adminEmail || !this.adminPassword) return;
    this.loading = true;
    this.error = '';
    try {
      const user = await this.auth.login(this.adminEmail, this.adminPassword);
      const dest = user.role === 'admin' ? '/admin' : '/';
      this.router.navigate([dest]);
    } catch (err: any) {
      this.error = err?.error?.message || 'Admin login failed. Invalid credentials.';
    } finally {
      this.loading = false;
    }
  }
}
