import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="detail-page">
      @if (loading) {
        <div class="loading-state"><div class="spinner"></div><p>Loading product...</p></div>
      }
      @if (!loading && !product) {
        <div class="not-found"><h2>Product not found</h2><a routerLink="/products" class="btn-back">← Back to Products</a></div>
      }
      @if (!loading && product) {
        <div class="detail-container">
          <div class="breadcrumb">
            <a routerLink="/">Home</a> →
            <a routerLink="/products">Products</a> →
            <span>{{ product.name }}</span>
          </div>
          <div class="detail-grid">
            <div class="product-image">
              <div class="img-wrapper">
                <img [src]="product.image_url || 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80'" [alt]="product.name" />
                <div class="img-badges">
                  @if (product.is_new) { <span class="badge-new">New Arrival</span> }
                  @if (product.is_featured) { <span class="badge-featured">✦ Featured</span> }
                </div>
              </div>
            </div>
            <div class="product-details">
              <p class="category-label">{{ product.category_name }}</p>
              <h1>{{ product.name }}</h1>
              <div class="price-row">
                <span class="price">₹{{ product.price | number:'1.0-0' }}</span>
                @if (product.original_price) {
                  <span class="original-price">₹{{ product.original_price | number:'1.0-0' }}</span>
                  <span class="discount-pct">{{ getDiscount() }}% OFF</span>
                }
              </div>
              <div class="rating"><span class="stars">★★★★☆</span><span class="rating-text">4.0 (128 reviews)</span></div>
              <p class="description">{{ product.description }}</p>
              <div class="divider"></div>
              @if (product.sizes) {
                <div class="selector-group">
                  <h4>Size</h4>
                  <div class="size-options">
                    @for (size of getSizes(); track size) {
                      <button [class.selected]="selectedSize === size" (click)="selectedSize = size" class="size-btn">{{ size }}</button>
                    }
                  </div>
                </div>
              }
              @if (product.colors) {
                <div class="selector-group">
                  <h4>Color: <strong>{{ selectedColor }}</strong></h4>
                  <div class="color-options">
                    @for (color of getColors(); track color) {
                      <button [class.selected]="selectedColor === color" (click)="selectedColor = color" class="color-btn">{{ color }}</button>
                    }
                  </div>
                </div>
              }
              <div class="selector-group">
                <h4>Quantity</h4>
                <div class="quantity-control">
                  <button (click)="decreaseQty()">-</button>
                  <span>{{ qty }}</span>
                  <button (click)="increaseQty()">+</button>
                </div>
              </div>
              <div class="cta-buttons">
                <button class="btn-add-cart" (click)="addToCart()">🛍 Add to Cart</button>
                <button class="btn-wishlist">♡ Wishlist</button>
              </div>
              <div class="product-features">
                <div class="feature">🚚 Free delivery on orders above ₹999</div>
                <div class="feature">↩️ 30-day easy returns</div>
                <div class="feature">✓ {{ product.stock }} items in stock</div>
                <div class="feature">🔒 Secure payment</div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
    @if (toastMessage) {
      <div class="toast" [class.toast-error]="toastError">{{ toastMessage }}</div>
    }
  `,
  styles: [`
    .detail-page { min-height:100vh; background:#FAF6F0; }
    .loading-state { text-align:center; padding:100px; }
    .spinner { width:40px; height:40px; border:3px solid #E8DDD0; border-top:3px solid #8B6847; border-radius:50%; animation:spin 1s linear infinite; margin:0 auto 15px; }
    @keyframes spin { to { transform:rotate(360deg); } }
    .not-found { text-align:center; padding:100px; }
    .btn-back { display:inline-block; margin-top:20px; padding:12px 24px; background:#8B6847; color:white; text-decoration:none; border-radius:8px; }
    .detail-container { max-width:1100px; margin:0 auto; padding:30px 20px; }
    .breadcrumb { font-size:0.85rem; color:#888; margin-bottom:30px; }
    .breadcrumb a { color:#8B6847; text-decoration:none; margin:0 6px; }
    .detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:50px; align-items:start; }
    .img-wrapper { position:relative; border-radius:20px; overflow:hidden; box-shadow:0 15px 50px rgba(139,104,71,0.15); }
    .img-wrapper img { width:100%; height:550px; object-fit:cover; display:block; }
    .img-badges { position:absolute; top:16px; left:16px; display:flex; gap:8px; }
    .badge-new { background:#8B6847; color:white; padding:6px 14px; border-radius:20px; font-size:0.8rem; font-weight:600; }
    .badge-featured { background:gold; color:#4A3728; padding:6px 14px; border-radius:20px; font-size:0.8rem; font-weight:600; }
    .category-label { font-size:0.75rem; text-transform:uppercase; letter-spacing:2px; color:#8B6847; margin-bottom:10px; }
    h1 { font-family:Georgia,serif; font-size:2rem; color:#4A3728; margin-bottom:18px; line-height:1.2; }
    .price-row { display:flex; align-items:center; gap:12px; margin-bottom:15px; }
    .price { font-size:1.8rem; font-weight:700; color:#8B6847; }
    .original-price { font-size:1.1rem; color:#aaa; text-decoration:line-through; }
    .discount-pct { background:#e8f5e9; color:#2e7d32; padding:3px 10px; border-radius:20px; font-size:0.8rem; font-weight:700; }
    .rating { display:flex; align-items:center; gap:8px; margin-bottom:20px; }
    .stars { color:#f4bc32; font-size:1.1rem; }
    .rating-text { font-size:0.85rem; color:#888; }
    .description { color:#555; line-height:1.8; font-size:0.95rem; margin-bottom:20px; }
    .divider { border:none; border-top:1px solid #E8DDD0; margin:20px 0; }
    .selector-group { margin-bottom:22px; }
    .selector-group h4 { font-size:0.9rem; color:#4A3728; margin-bottom:10px; font-weight:600; }
    .size-options, .color-options { display:flex; flex-wrap:wrap; gap:8px; }
    .size-btn, .color-btn { padding:8px 16px; border:1.5px solid #ddd; border-radius:8px; cursor:pointer; font-size:0.85rem; background:white; color:#555; transition:all 0.2s; }
    .size-btn:hover, .color-btn:hover { border-color:#8B6847; color:#8B6847; }
    .size-btn.selected, .color-btn.selected { background:#8B6847; color:white; border-color:#8B6847; }
    .quantity-control { display:flex; align-items:center; border:1.5px solid #ddd; border-radius:10px; overflow:hidden; width:fit-content; }
    .quantity-control button { width:40px; height:40px; border:none; background:#f8f8f8; cursor:pointer; font-size:1.2rem; transition:background 0.2s; }
    .quantity-control button:hover { background:#E8DDD0; }
    .quantity-control span { width:50px; text-align:center; font-weight:600; color:#4A3728; }
    .cta-buttons { display:flex; gap:12px; margin:25px 0; }
    .btn-add-cart { flex:2; padding:16px; background:#8B6847; color:white; border:none; border-radius:12px; cursor:pointer; font-size:1rem; font-weight:700; transition:background 0.2s; }
    .btn-add-cart:hover { background:#b04a5a; }
    .btn-wishlist { flex:1; padding:16px; background:white; color:#8B6847; border:2px solid #8B6847; border-radius:12px; cursor:pointer; font-size:0.95rem; font-weight:600; transition:all 0.2s; }
    .btn-wishlist:hover { background:#F0E8DC; }
    .product-features { display:flex; flex-direction:column; gap:10px; }
    .feature { font-size:0.85rem; color:#555; padding:10px 14px; background:#FAF6F0; border-radius:8px; }
    .toast { position:fixed; bottom:30px; right:30px; background:#4A3728; color:white; padding:14px 24px; border-radius:10px; font-size:0.9rem; z-index:9999; }
    .toast-error { background:#e74c3c; }
    @media(max-width:768px) { .detail-grid { grid-template-columns:1fr; } }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  selectedSize = 'M';
  selectedColor = '';
  qty = 1;
  toastMessage = '';
  toastError = false;

  constructor(
    private productService: ProductService, 
    private cartService: CartService, 
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productService.getProduct(params["id"]).subscribe({
        next: (res) => {
          if (res.success) {
            this.product = res.data;
            const sizes = this.getSizes();
            if (sizes.length > 0) this.selectedSize = sizes[0];
            const colors = this.getColors();
            if (colors.length > 0) this.selectedColor = colors[0];
          }
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    });
  }

  increaseQty(): void { this.qty++; }
  decreaseQty(): void { if (this.qty > 1) this.qty--; }

  getSizes(): string[] { return this.product?.sizes ? this.product.sizes.split(',').map(s => s.trim()) : []; }
  getColors(): string[] { return this.product?.colors ? this.product.colors.split(',').map(c => c.trim()) : []; }
  getDiscount(): number {
    if (!this.product?.original_price || !this.product.price) return 0;
    return Math.round(((this.product.original_price - this.product.price) / this.product.original_price) * 100);
  }

  addToCart(): void {
    if (!this.product?.id) return;
    if (!this.authService.isLoggedIn()) {
      this.showToast('Please sign in to add items to your cart.', true);
      return;
    }
    this.cartService.addToCart({ product_id: (this.product.id || this.product._id) as string, quantity: this.qty, size: this.selectedSize, color: this.selectedColor }).subscribe({
      next: () => this.showToast(this.product!.name + ' added to cart! 🛍'),
      error: () => this.showToast('Failed to add to cart', true)
    });
  }

  showToast(msg: string, error = false): void { this.toastMessage = msg; this.toastError = error; setTimeout(() => this.toastMessage = '', 3000); }
}
