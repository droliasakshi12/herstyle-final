import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="wrap">
        <div class="page-header">
          <div>
            <h1>My Wishlist</h1>
            <p>{{ items.length }} saved item{{ items.length !== 1 ? 's' : '' }}</p>
          </div>
          <a routerLink="/products" class="back-link">← Keep Browsing</a>
        </div>

        @if (items.length === 0) {
          <div class="empty-state">
            <div class="empty-icon">♡</div>
            <h2>Nothing saved yet</h2>
            <p>Tap the heart icon on any product to save it here.</p>
            <a routerLink="/products" class="btn-browse">Browse Products</a>
          </div>
        }

        @if (items.length > 0) {
          <div class="grid">
            @for (p of items; track p.id || p._id) {
              <div class="card">
                <div class="card-img">
                  <img [src]="p.image_url || fallback" [alt]="p.name" />
                  <button class="remove-heart" (click)="remove(p)" title="Remove from wishlist">♥</button>
                  @if (p.is_new) { <span class="badge-new">New</span> }
                  @if (p.original_price && p.original_price > p.price) { <span class="badge-sale">Sale</span> }
                </div>
                <div class="card-body">
                  <span class="cat-tag">{{ p.category_name || 'Collection' }}</span>
                  <h3>{{ p.name }}</h3>
                  <div class="price-row">
                    <span class="price">₹{{ p.price | number:'1.0-0' }}</span>
                    @if (p.original_price) { <span class="orig">₹{{ p.original_price | number:'1.0-0' }}</span> }
                  </div>
                  <div class="card-actions">
                    <a [routerLink]="(p.id || p._id) ? ['/products', p.id || p._id] : ['/products']" class="btn-view">View</a>
                    <button class="btn-cart" (click)="addToCart(p)">+ Add to Bag</button>
                  </div>
                </div>
              </div>
            }
          </div>
          <div class="actions-bar">
            <button class="btn-clear" (click)="clearAll()">🗑 Clear Wishlist</button>
          </div>
        }
      </div>
    </div>

    @if (toast) { <div class="toast">{{ toast }}</div> }
  `,
  styles: [`
    :host { --brown:#8B6847; --brown-dark:#6B4F33; --brown-light:#C4A882; --beige:#F5EFE6; --beige-card:#FAF6F0; --beige-border:#E8DDD0; --ink:#4A3728; --muted:#9C8877; --ink:#4A3728; --beige:#F5EFE6; display:block; font-family:'Jost',sans-serif; background:var(--beige); min-height:100vh; }
    .page { padding:40px 20px; }
    .wrap { max-width:1200px; margin:0 auto; }
    .page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:36px; }
    .page-header h1 { font-family:'Cormorant Garamond',Georgia,serif; font-size:2rem; color:var(--ink); margin:0 0 4px; }
    .page-header p { color:#999; font-size:0.88rem; margin:0; }
    .back-link { color:var(--brown); text-decoration:none; font-size:0.88rem; }
    .empty-state { text-align:center; padding:100px 20px; }
    .empty-icon { font-size:4rem; color:#f3bcc5; margin-bottom:16px; }
    .empty-state h2 { font-family:'Cormorant Garamond',Georgia,serif; font-size:1.8rem; color:var(--ink); margin-bottom:8px; }
    .empty-state p { color:#999; margin-bottom:28px; }
    .btn-browse { display:inline-block; padding:13px 32px; background:var(--brown); color:white; border-radius:8px; text-decoration:none; font-weight:600; }
    .grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
    .card { background:white; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.06); transition:transform 0.25s,box-shadow 0.25s; }
    .card:hover { transform:translateY(-4px); box-shadow:0 8px 28px rgba(0,0,0,0.1); }
    .card-img { position:relative; overflow:hidden; }
    .card-img img { width:100%; height:240px; object-fit:cover; display:block; transition:transform 0.4s; }
    .card:hover .card-img img { transform:scale(1.04); }
    .remove-heart { position:absolute; top:10px; right:10px; background:white; border:none; border-radius:50%; width:32px; height:32px; cursor:pointer; font-size:1.1rem; color:var(--brown); box-shadow:0 2px 8px rgba(0,0,0,0.12); display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
    .remove-heart:hover { background:var(--brown); color:white; transform:scale(1.1); }
    .badge-new { position:absolute; top:10px; left:10px; background:var(--brown); color:white; padding:3px 9px; border-radius:4px; font-size:0.68rem; font-weight:700; text-transform:uppercase; }
    .badge-sale { position:absolute; top:10px; left:10px; background:#e74c3c; color:white; padding:3px 9px; border-radius:4px; font-size:0.68rem; font-weight:700; text-transform:uppercase; }
    .card-body { padding:14px 16px; }
    .cat-tag { font-size:0.68rem; color:var(--brown); text-transform:uppercase; letter-spacing:1.5px; font-weight:600; }
    .card-body h3 { font-size:0.9rem; color:var(--ink); font-weight:600; margin:5px 0 8px; line-height:1.35; }
    .price-row { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
    .price { font-size:1rem; font-weight:700; color:var(--brown); }
    .orig { font-size:0.8rem; color:#bbb; text-decoration:line-through; }
    .card-actions { display:flex; gap:8px; }
    .btn-view { flex:1; text-align:center; padding:9px 0; border:1.5px solid var(--brown); color:var(--brown); border-radius:7px; text-decoration:none; font-size:0.83rem; font-weight:600; transition:all 0.2s; }
    .btn-view:hover { background:var(--brown); color:white; }
    .btn-cart { flex:1; padding:9px 0; background:var(--brown); color:white; border:none; border-radius:7px; cursor:pointer; font-size:0.83rem; font-weight:600; transition:background 0.2s; }
    .btn-cart:hover { background:#6B4F33; }
    .actions-bar { margin-top:28px; display:flex; justify-content:flex-end; }
    .btn-clear { background:none; border:1.5px solid #E8DDD0; color:#999; padding:10px 20px; border-radius:8px; cursor:pointer; font-size:0.85rem; transition:all 0.2s; }
    .btn-clear:hover { border-color:#e74c3c; color:#e74c3c; }
    .toast { position:fixed; bottom:28px; right:28px; background:var(--ink); color:white; padding:12px 22px; border-radius:8px; font-size:0.88rem; z-index:9999; animation:fadeUp 0.3s ease; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;} }
    @media(max-width:1024px) { .grid { grid-template-columns:repeat(3,1fr); } }
    @media(max-width:768px)  { .grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:480px)  { .grid { grid-template-columns:1fr 1fr; gap:12px; } }
  `]
})
export class WishlistComponent implements OnInit, OnDestroy {
  items: Product[] = [];
  toast = '';
  fallback = 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80';
  private sub!: Subscription;

  constructor(public wishlistService: WishlistService, private cartService: CartService) {}

  ngOnInit() { this.sub = this.wishlistService.items$.subscribe(items => this.items = items); }
  ngOnDestroy() { this.sub?.unsubscribe(); }

  remove(p: Product) {
    const id = (p.id || p._id) as string;
    this.wishlistService.remove(id);
    this.showToast('Removed from wishlist');
  }

  clearAll() {
    if (!confirm('Clear your entire wishlist?')) return;
    [...this.items].forEach(p => this.wishlistService.remove((p.id || p._id) as string));
    this.showToast('Wishlist cleared');
  }

  addToCart(p: Product) {
    const pid = (p.id || p._id) as string;
    if (!pid) { this.showToast('Connect your backend to add real products!'); return; }
    this.cartService.addToCart({ product_id: pid, quantity: 1, size: 'M', color: '' }).subscribe({
      next: () => this.showToast(p.name + ' added to bag ✓'),
      error: () => this.showToast('Could not add to bag')
    });
  }

  showToast(msg: string) { this.toast = msg; setTimeout(() => this.toast = '', 3000); }
}
