import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product, Category } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-top">
        <h1>{{ pageTitle }}</h1>
        <p>{{ displayProducts().length }} styles for you</p>
      </div>

      <div class="layout">
        <!-- Sidebar -->
        <aside class="sidebar">
          <div class="filter-block">
            <label class="filter-label">Search</label>
            <input [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()" placeholder="Search products…" class="search-box" />
          </div>
          <div class="filter-block">
            <label class="filter-label">Category</label>
            <div class="cat-list">
              <button [class.active]="selectedCat === ''" (click)="setCat('')">All</button>
              @for (cat of categories; track cat._id) {
                <button [class.active]="selectedCat === (cat.id || cat._id)"
                  (click)="setCat((cat.id || cat._id) ?? '')">{{ cat.name }}</button>
              }
            </div>
          </div>
          <div class="filter-block">
            <label class="filter-label">Filter</label>
            <label class="check"><input type="checkbox" [(ngModel)]="onlyFeatured" (change)="applyFilters()" /> Featured</label>
            <label class="check"><input type="checkbox" [(ngModel)]="onlyNew" (change)="applyFilters()" /> New Arrivals</label>
          </div>
          <button class="clear-btn" (click)="clearAll()">Clear Filters</button>
        </aside>

        <!-- Grid -->
        <main class="main">
          @if (loading) {
            <div class="loading-state"><div class="spin"></div><p>Loading…</p></div>
          }
          @if (!loading) {
            <div class="grid">
              @for (p of displayProducts(); track p.id || p._id || p.name) {
                <div class="card">
                  <!-- Clicking image or name → product detail -->
                  <div class="card-img" (click)="goToProduct(p)">
                    <img [src]="p.image_url" [alt]="p.name" />
                    <div class="badges">
                      @if (p.is_new) { <span class="badge-new">New</span> }
                      @if (p.original_price && p.original_price > p.price) { <span class="badge-sale">Sale</span> }
                    </div>
                    <!-- Wishlist heart — stops propagation so it doesn't navigate -->
                    <button class="heart-btn"
                      [class.active]="(p.id || p._id) && wishlistService.isWishlisted((p.id || p._id) ?? '')"
                      (click)="toggleWishlist(p, $event)">
                      {{ (p.id || p._id) && wishlistService.isWishlisted((p.id || p._id) ?? '') ? '♥' : '♡' }}
                    </button>
                  </div>
                  <div class="card-body">
                    <span class="cat-tag">{{ p.category_name || 'Collection' }}</span>
                    <!-- Clicking name → product detail -->
                    <h3 (click)="goToProduct(p)">{{ p.name }}</h3>
                    <div class="price-row">
                      <span class="price">₹{{ p.price | number:'1.0-0' }}</span>
                      @if (p.original_price) { <span class="orig">₹{{ p.original_price | number:'1.0-0' }}</span> }
                    </div>
                    <div class="card-actions">
                      <!-- View button → product detail -->
                      <button class="btn-view" (click)="goToProduct(p)">View</button>
                      <!-- Cart button — only this adds to cart -->
                      <button class="btn-cart" (click)="addToCart(p, $event)">+ Cart</button>
                    </div>
                  </div>
                </div>
              }
              @if (displayProducts().length === 0) {
                <div class="empty"><p>No products found.</p><button (click)="clearAll()">Clear Filters</button></div>
              }
            </div>
          }
        </main>
      </div>
    </div>

    @if (toast) { <div class="toast" [class.err]="toastErr">{{ toast }}</div> }
  `,
  styles: [`
    :host { --brown:#8B6847; --brown-dark:#6B4F33; --brown-light:#C4A882; --beige:#F5EFE6; --beige-card:#FAF6F0; --beige-border:#E8DDD0; --ink:#4A3728; --muted:#9C8877; --ink:#4A3728; --beige:#F5EFE6; --muted:#9C8877; display:block; font-family:'Jost',sans-serif; background:var(--beige); }
    .page-top { background:linear-gradient(135deg,#4A3728,#6B4F33); color:white; padding:44px 40px; }
    .page-top h1 { font-family:'Cormorant Garamond',Georgia,serif; font-size:2rem; margin:0 0 6px; }
    .page-top p { opacity:0.65; font-size:0.88rem; margin:0; }
    .layout { max-width:1280px; margin:0 auto; padding:36px 32px; display:grid; grid-template-columns:220px 1fr; gap:32px; }
    .sidebar { background:white; border-radius:12px; padding:24px; height:fit-content; box-shadow:0 2px 12px rgba(0,0,0,0.05); }
    .filter-block { margin-bottom:22px; padding-bottom:18px; border-bottom:1px solid #EDE3D4; }
    .filter-block:last-of-type { border-bottom:none; }
    .filter-label { display:block; font-size:0.7rem; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:10px; font-weight:600; }
    .search-box { width:100%; padding:9px 12px; border:1.5px solid #E8DDD0; border-radius:8px; font-size:0.88rem; outline:none; box-sizing:border-box; }
    .search-box:focus { border-color:var(--brown); }
    .cat-list { display:flex; flex-direction:column; gap:3px; }
    .cat-list button { text-align:left; padding:7px 12px; border:none; background:none; border-radius:7px; font-size:0.86rem; color:#555; cursor:pointer; transition:all 0.2s; font-family:'Jost',sans-serif; }
    .cat-list button:hover,.cat-list button.active { background:#F0E8DC; color:var(--brown); font-weight:600; }
    .check { display:flex; align-items:center; gap:8px; font-size:0.86rem; color:#555; margin-bottom:8px; cursor:pointer; }
    .check input { accent-color:var(--brown); }
    .clear-btn { width:100%; padding:9px; background:#F0E8DC; color:var(--brown); border:none; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.84rem; transition:all 0.2s; margin-top:4px; font-family:'Jost',sans-serif; }
    .clear-btn:hover { background:var(--brown); color:white; }
    .main { min-height:400px; }
    .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }

    /* CARD */
    .card { background:white; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.06); transition:transform 0.25s,box-shadow 0.25s; }
    .card:hover { transform:translateY(-4px); box-shadow:0 8px 28px rgba(0,0,0,0.1); }

    /* Image area — cursor pointer shows it's clickable */
    .card-img { position:relative; overflow:hidden; cursor:pointer; }
    .card-img img { width:100%; height:260px; object-fit:cover; display:block; transition:transform 0.4s; }
    .card-img:hover img { transform:scale(1.04); }

    .badges { position:absolute; top:10px; left:10px; display:flex; gap:5px; }
    .badge-new  { background:var(--brown); color:white; padding:3px 9px; border-radius:4px; font-size:0.68rem; font-weight:700; text-transform:uppercase; }
    .badge-sale { background:#e74c3c; color:white; padding:3px 9px; border-radius:4px; font-size:0.68rem; font-weight:700; text-transform:uppercase; }
    .heart-btn { position:absolute; top:10px; right:10px; background:white; border:none; border-radius:50%; width:32px; height:32px; cursor:pointer; font-size:1.05rem; color:#ccc; box-shadow:0 2px 8px rgba(0,0,0,0.12); transition:all 0.2s; display:flex; align-items:center; justify-content:center; z-index:2; }
    .heart-btn:hover,.heart-btn.active { color:var(--brown); transform:scale(1.1); }

    .card-body { padding:14px 16px; }
    .cat-tag { font-size:0.68rem; color:var(--brown); text-transform:uppercase; letter-spacing:1.5px; font-weight:600; }
    /* Name also shows pointer */
    .card-body h3 { font-size:0.92rem; color:var(--ink); font-weight:600; margin:5px 0 8px; line-height:1.35; cursor:pointer; }
    .card-body h3:hover { color:var(--brown); }
    .price-row { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
    .price { font-size:1rem; font-weight:700; color:var(--brown); }
    .orig  { font-size:0.8rem; color:#bbb; text-decoration:line-through; }

    .card-actions { display:flex; gap:8px; }
    .btn-view { flex:1; padding:9px 0; border:1.5px solid var(--brown); color:var(--brown); border-radius:7px; background:none; cursor:pointer; font-size:0.83rem; font-weight:600; transition:all 0.2s; font-family:'Jost',sans-serif; }
    .btn-view:hover { background:var(--brown); color:white; }
    .btn-cart { flex:1; padding:9px 0; background:var(--brown); color:white; border:none; border-radius:7px; cursor:pointer; font-size:0.83rem; font-weight:600; transition:background 0.2s; font-family:'Jost',sans-serif; }
    .btn-cart:hover { background:#6B4F33; }

    .loading-state { text-align:center; padding:80px 20px; color:var(--muted); }
    .spin { width:36px; height:36px; border:3px solid #E8DDD0; border-top:3px solid var(--brown); border-radius:50%; animation:spin 0.9s linear infinite; margin:0 auto 14px; }
    @keyframes spin { to{transform:rotate(360deg);} }
    .empty { grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--muted); }
    .empty button { margin-top:14px; padding:10px 24px; background:var(--brown); color:white; border:none; border-radius:8px; cursor:pointer; font-family:'Jost',sans-serif; }

    .toast { position:fixed; bottom:28px; right:28px; background:var(--ink); color:white; padding:12px 22px; border-radius:8px; font-size:0.88rem; z-index:9999; animation:fadeUp 0.3s ease; }
    .toast.err { background:#c0392b; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;} }

    @media(max-width:900px) { .layout{grid-template-columns:1fr;padding:20px;} .sidebar{display:none;} .grid{grid-template-columns:repeat(2,1fr);} }
    @media(max-width:480px) { .grid{grid-template-columns:1fr 1fr;gap:12px;} .page-top{padding:28px 20px;} }
  `]
})
export class ProductsComponent implements OnInit {
  allProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;
  searchTerm = '';
  selectedCat = '';
  onlyFeatured = false;
  onlyNew = false;
  pageTitle = 'All Products';
  toast = ''; toastErr = false;
  private searchTimer: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public wishlistService: WishlistService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: res => { if (res.success) this.categories = res.data; }
    });
    this.route.queryParams.subscribe(params => {
      if (params['category']) this.selectedCat = params['category'];
      if (params['featured']) this.onlyFeatured = true;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    const filters: Record<string,string> = {};
    if (this.selectedCat)  filters['category'] = this.selectedCat;
    if (this.onlyFeatured) filters['featured']  = 'true';
    if (this.onlyNew)      filters['new']        = 'true';
    if (this.searchTerm)   filters['search']     = this.searchTerm;
    this.productService.getProducts(filters).subscribe({
      next: res => { if (res.success) this.allProducts = res.data; this.loading = false; this.updateTitle(); },
      error: () => { this.allProducts = []; this.loading = false; }
    });
  }

  applyFilters(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadProducts(), 350);
  }

  displayProducts(): any[] { return this.allProducts; }

  setCat(id: string): void   { this.selectedCat = id; this.loadProducts(); }
  clearAll(): void { this.searchTerm = ''; this.selectedCat = ''; this.onlyFeatured = false; this.onlyNew = false; this.loadProducts(); }

  updateTitle(): void {
    if (this.searchTerm)   { this.pageTitle = 'Search: "' + this.searchTerm + '"'; return; }
    if (this.onlyFeatured) { this.pageTitle = 'Featured Products'; return; }
    if (this.onlyNew)      { this.pageTitle = 'New Arrivals'; return; }
    if (this.selectedCat)  {
      const cat = this.categories.find(c => (c.id || c._id) === this.selectedCat);
      this.pageTitle = cat ? cat.name : 'Products'; return;
    }
    this.pageTitle = 'All Products';
  }

  // Navigate to product detail — only called from image / name / View button
  goToProduct(p: any): void {
    const id = p.id || p._id;
    if (id) { this.router.navigate(['/products', id]); }
  }

  // Add to cart — only called from the Cart button, stops propagation
  addToCart(p: any, e: Event): void {
    e.stopPropagation();
    const pid = p.id || p._id;
    if (!pid) { this.showToast('Connect backend to add products!'); return; }
    this.cartService.addToCart({ product_id: pid, quantity: 1, size: 'M', color: '' }).subscribe({
      next: () => this.showToast(p.name + ' added to cart ✓'),
      error: () => this.showToast('Could not add to cart', true)
    });
  }

  toggleWishlist(p: any, e: Event): void {
    e.stopPropagation();
    const added = this.wishlistService.toggle(p);
    this.showToast(added ? p.name + ' added to wishlist ♥' : 'Removed from wishlist');
  }

  showToast(msg: string, err = false): void {
    this.toast = msg; this.toastErr = err;
    setTimeout(() => this.toast = '', 3000);
  }
}
