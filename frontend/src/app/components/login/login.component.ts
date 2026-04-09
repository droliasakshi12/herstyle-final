import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

        <div id="google-btn" class="google-btn-wrap"></div>

        <p class="login-divider">or</p>

        <button class="google-manual-btn" (click)="promptGoogle()" [disabled]="loading">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p class="login-footer">
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
    @media(max-width:768px) {
      .login-bg { display:none; }
      .login-card { flex:1; max-width:100%; padding:40px 24px; }
    }
  `]
})
export class LoginComponent implements OnInit, AfterViewInit {
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router, private ngZone: NgZone) {}

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
}
