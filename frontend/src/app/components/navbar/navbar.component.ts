import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/" class="logo">
          <img src="/logo.png" alt="HerStyle" class="logo-img" />
        </a>

        <ul class="nav-links" [class.open]="menuOpen">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a></li>
          <li><a routerLink="/products" routerLinkActive="active">Shop</a></li>
          <li><a routerLink="/about" routerLinkActive="active">About</a></li>
          <li><a routerLink="/contact" routerLinkActive="active">Contact</a></li>
          @if (auth.isAdmin()) {
            <li><a routerLink="/admin" routerLinkActive="active" class="admin-link">Admin ⚙️</a></li>
          }
        </ul>

        <div class="nav-icons">
          <a routerLink="/wishlist" class="icon-btn" title="Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            @if (wishCount > 0) { <span class="badge">{{ wishCount }}</span> }
          </a>
          <a routerLink="/cart" class="icon-btn" title="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            @if (cartCount > 0) { <span class="badge">{{ cartCount }}</span> }
          </a>

          @if (auth.isLoggedIn()) {
            <div class="user-menu" (click)="toggleUserMenu()" [class.open]="userMenuOpen">
              <div class="user-avatar">
                @if (auth.user()?.picture) {
                  <img [src]="auth.user()!.picture" [alt]="auth.user()!.name" class="avatar-img" />
                } @else {
                  <span>{{ getInitial() }}</span>
                }
              </div>
              @if (userMenuOpen) {
                <div class="user-dropdown" (click)="$event.stopPropagation()">
                  <div class="user-dropdown-header">
                    <strong>{{ auth.user()?.name }}</strong>
                    <span>{{ auth.user()?.email }}</span>
                    @if (auth.isAdmin()) { <span class="role-badge">Admin</span> }
                  </div>
                  @if (auth.isAdmin()) {
                    <a routerLink="/admin" class="dropdown-item" (click)="userMenuOpen=false">⚙️ Admin Panel</a>
                  }
                  <button class="dropdown-item logout-btn" (click)="logout()">🚪 Sign Out</button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/login" class="login-btn">Sign In</a>
          }

          <button class="menu-toggle" (click)="toggleMenu()">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host { --brown:#8B6847; --brown-dark:#6B4F33; --beige:#F5EFE6; --beige-border:#E8DDD0; --ink:#4A3728; }
    .navbar { background:#FFFCF8; border-bottom:1px solid var(--beige-border); position:sticky; top:0; z-index:1000; box-shadow:0 2px 16px rgba(139,104,71,0.08); }
    .nav-inner { max-width:1280px; margin:0 auto; padding:0 40px; display:flex; align-items:center; justify-content:space-between; height:72px; gap:32px; }
    .logo { display:flex; align-items:center; text-decoration:none; flex-shrink:0; }
    .logo-img { height:56px; width:auto; object-fit:contain; display:block; transition:opacity 0.2s; }
    .logo:hover .logo-img { opacity:0.85; }
    .nav-links { display:flex; list-style:none; gap:36px; margin:0; padding:0; flex:1; justify-content:center; }
    .nav-links a { text-decoration:none; color:var(--ink); font-size:0.88rem; font-weight:400; letter-spacing:1px; text-transform:uppercase; padding-bottom:3px; border-bottom:1.5px solid transparent; transition:all 0.2s; font-family:'Jost',sans-serif; }
    .nav-links a:hover, .nav-links a.active { color:var(--brown); border-bottom-color:var(--brown); }
    .admin-link { color:var(--brown) !important; font-weight:600 !important; }
    .nav-icons { display:flex; align-items:center; gap:4px; position:relative; }
    .icon-btn { position:relative; display:flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:6px; color:var(--ink); text-decoration:none; transition:all 0.2s; }
    .icon-btn:hover { background:var(--beige); color:var(--brown); }
    .badge { position:absolute; top:2px; right:2px; background:var(--brown); color:white; border-radius:50%; width:16px; height:16px; font-size:0.6rem; font-weight:600; display:flex; align-items:center; justify-content:center; }
    .login-btn { padding:8px 18px; background:var(--brown); color:white; border-radius:7px; text-decoration:none; font-size:.82rem; font-weight:600; letter-spacing:.4px; transition:background .2s; margin-left:4px; }
    .login-btn:hover { background:var(--brown-dark); }
    .user-menu { position:relative; cursor:pointer; margin-left:4px; }
    .user-avatar { width:36px; height:36px; border-radius:50%; background:var(--brown); color:white; font-size:.9rem; font-weight:700; display:flex; align-items:center; justify-content:center; overflow:hidden; border:2px solid var(--beige-border); transition:border-color .2s; }
    .user-menu:hover .user-avatar, .user-menu.open .user-avatar { border-color:var(--brown); }
    .avatar-img { width:100%; height:100%; object-fit:cover; }
    .user-dropdown { position:absolute; top:calc(100% + 8px); right:0; width:220px; background:white; border:1px solid var(--beige-border); border-radius:12px; box-shadow:0 8px 32px rgba(74,55,40,.12); overflow:hidden; z-index:200; }
    .user-dropdown-header { padding:16px; border-bottom:1px solid var(--beige-border); }
    .user-dropdown-header strong { display:block; font-size:.9rem; color:var(--ink); margin-bottom:2px; }
    .user-dropdown-header span { display:block; font-size:.78rem; color:#9e8070; }
    .role-badge { display:inline-block; background:var(--brown); color:white; font-size:.68rem; font-weight:700; padding:2px 8px; border-radius:10px; margin-top:6px; letter-spacing:.5px; }
    .dropdown-item { display:block; width:100%; padding:11px 16px; text-align:left; font-size:.88rem; color:var(--ink); text-decoration:none; background:none; border:none; cursor:pointer; font-family:inherit; transition:background .15s; }
    .dropdown-item:hover { background:var(--beige); }
    .logout-btn { color:#c0392b; border-top:1px solid var(--beige-border); }
    .menu-toggle { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:6px; }
    .menu-toggle span { display:block; width:20px; height:1.5px; background:var(--ink); transition:all 0.3s; }
    @media(max-width:768px) {
      .nav-inner { padding:0 20px; }
      .menu-toggle { display:flex; }
      .nav-links { display:none; position:absolute; top:72px; left:0; right:0; background:#FFFCF8; flex-direction:column; padding:16px 24px; gap:4px; box-shadow:0 8px 24px rgba(74,55,40,.08); border-top:1px solid var(--beige-border); justify-content:flex-start; }
      .nav-links.open { display:flex; }
      .nav-links a { padding:10px 0; font-size:.95rem; border-bottom:none; }
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartCount = 0; wishCount = 0; menuOpen = false; userMenuOpen = false;
  private subs: Subscription[] = [];

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.subs.push(this.cartService.cartCount$.subscribe(n => this.cartCount = n));
    this.subs.push(this.wishlistService.items$.subscribe(items => this.wishCount = items.length));
  }
  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  getInitial(): string {
    const name = this.auth.user()?.name;
    return name ? name[0].toUpperCase() : '?';
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  toggleUserMenu() { this.userMenuOpen = !this.userMenuOpen; }
  logout() { this.userMenuOpen = false; this.auth.logout(); }
}
