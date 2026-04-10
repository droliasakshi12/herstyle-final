import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage your HerStyle store</p>
      </div>

      <div class="stats-bar">
        <div class="stat-card"><span class="stat-icon">👗</span><div><strong>{{ products.length }}</strong><span>Products</span></div></div>
        <div class="stat-card"><span class="stat-icon">📁</span><div><strong>{{ categories.length }}</strong><span>Categories</span></div></div>
        <div class="stat-card"><span class="stat-icon">⭐</span><div><strong>{{ featuredCount }}</strong><span>Featured</span></div></div>
        <div class="stat-card"><span class="stat-icon">🆕</span><div><strong>{{ newCount }}</strong><span>New Arrivals</span></div></div>
      </div>

      <div class="admin-body">
        <div class="tabs">
          <button [class.active]="activeTab === 'products'"   (click)="setTab('products')">Products</button>
          <button [class.active]="activeTab === 'categories'" (click)="setTab('categories')">Categories</button>
          <button [class.active]="activeTab === 'orders'"     (click)="setTab('orders')">Orders</button>
        </div>

        <!-- PRODUCTS TAB -->
        @if (activeTab === 'products') {
          <div class="tab-content">
            <div class="tab-toolbar">
              <h2>All Products</h2>
              <button class="btn-add" (click)="openProductForm()">+ Add Product</button>
            </div>

            @if (categories.length === 0) {
              <div class="seed-warning">
                ⚠️ No categories found in database. Run <code>node seed.js</code> in your backend folder first, then refresh this page.
              </div>
            }

            @if (loading) { <div class="loading-state"><div class="spinner"></div><p>Loading…</p></div> }
            @if (!loading) {
              <div class="data-table">
                <table>
                  <thead>
                    <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Tags</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    @for (product of products; track product._id) {
                      <tr>
                        <td><img [src]="product.image_url || 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=60&q=80'" [alt]="product.name" class="table-img" /></td>
                        <td class="name-cell">{{ product.name }}</td>
                        <td>{{ product.category_name || '—' }}</td>
                        <td>₹{{ product.price | number:'1.0-0' }}</td>
                        <td>{{ product.stock }}</td>
                        <td>
                          @if (product.is_featured) { <span class="badge badge-featured">Featured</span> }
                          @if (product.is_new)      { <span class="badge badge-new">New</span> }
                          @if (!product.is_featured && !product.is_new) { <span class="badge badge-none">—</span> }
                        </td>
                        <td class="actions-cell">
                          <button class="btn-edit"   (click)="editProduct(product)">Edit</button>
                          <button class="btn-delete" (click)="deleteProduct(product._id ?? product.id ?? '')">Delete</button>
                        </td>
                      </tr>
                    }
                    @if (products.length === 0) {
                      <tr><td colspan="7" class="empty-row">No products yet. Add one using the button above.</td></tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        }

        <!-- CATEGORIES TAB -->
        @if (activeTab === 'categories') {
          <div class="tab-content">
            <div class="tab-toolbar">
              <h2>Categories</h2>
              <button class="btn-add" (click)="openCategoryForm()">+ Add Category</button>
            </div>
            @if (categories.length === 0) {
              <div class="seed-warning">
                ⚠️ No categories in database. Run <code>node seed.js</code> in your backend folder to add them.
              </div>
            }
            <div class="categories-grid">
              @for (cat of categories; track cat._id) {
                <div class="cat-admin-card">
                  <img [src]="cat.image_url || 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80'" [alt]="cat.name" />
                  <div class="cat-admin-info"><h3>{{ cat.name }}</h3><p>{{ cat.description }}</p></div>
                  <div class="cat-admin-actions">
                    <button class="btn-edit"   (click)="editCategory(cat)">Edit</button>
                    <button class="btn-delete" (click)="deleteCategory(cat._id ?? cat.id ?? '')">Delete</button>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- ORDERS TAB -->
        @if (activeTab === 'orders') {
          <div class="tab-content">
            <div class="tab-toolbar">
              <h2>All Orders</h2>
              <button class="btn-add" (click)="loadOrders()">↻ Refresh</button>
            </div>
            <div class="data-table">
              <table>
                <thead>
                  <tr><th>Order ID</th><th>Customer</th><th>Email</th><th>Total</th><th>Status</th><th>Date</th><th>Update</th></tr>
                </thead>
                <tbody>
                  @for (order of orders; track order._id) {
                    <tr>
                      <td class="order-id">#{{ (order._id + '').slice(-6).toUpperCase() }}</td>
                      <td>{{ order.customer_name }}</td>
                      <td>{{ order.customer_email }}</td>
                      <td>₹{{ order.total_amount | number:'1.0-0' }}</td>
                      <td><span class="status-badge" [ngClass]="'status-' + order.status">{{ order.status }}</span></td>
                      <td>{{ order.createdAt | date:'dd MMM yyyy' }}</td>
                      <td>
                        <select class="status-select" (change)="updateOrderStatus(order._id, getVal($event))">
                          <option value="pending"    [selected]="order.status === 'pending'">Pending</option>
                          <option value="processing" [selected]="order.status === 'processing'">Processing</option>
                          <option value="shipped"    [selected]="order.status === 'shipped'">Shipped</option>
                          <option value="delivered"  [selected]="order.status === 'delivered'">Delivered</option>
                          <option value="cancelled"  [selected]="order.status === 'cancelled'">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  }
                  @if (orders.length === 0) {
                    <tr><td colspan="7" class="empty-row">No orders yet.</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- PRODUCT FORM MODAL -->
    @if (showProductForm) {
      <div class="overlay" (click)="closeProductForm()">
        <div class="modal large-modal" (click)="$event.stopPropagation()">
          <button class="modal-x" (click)="closeProductForm()">✕</button>
          <h2>{{ editingProductId ? 'Edit Product' : 'Add New Product' }}</h2>

          @if (formError) { <div class="form-error">{{ formError }}</div> }

          <div class="form-grid">
            <div class="form-group full">
              <label>Product Name *</label>
              <input type="text" [(ngModel)]="pf.name" placeholder="e.g. Floral Wrap Dress" />
            </div>
            <div class="form-group full">
              <label>Description</label>
              <textarea [(ngModel)]="pf.description" rows="3" placeholder="Product description…"></textarea>
            </div>
            <div class="form-group">
              <label>Price (₹) *</label>
              <input type="number" [(ngModel)]="pf.price" placeholder="1499" min="1" />
            </div>
            <div class="form-group">
              <label>Original Price (₹) <span class="hint">for showing discount</span></label>
              <input type="number" [(ngModel)]="pf.original_price" placeholder="1999" min="0" />
            </div>
            <div class="form-group">
              <label>Category *</label>
              <select [(ngModel)]="pf.category_id">
                <option value="">— Select a category —</option>
                @for (cat of categories; track cat._id) {
                  <option [value]="cat._id || cat.id">{{ cat.name }}</option>
                }
              </select>
              @if (categories.length === 0) {
                <span class="field-hint-err">⚠ No categories found. Run <code>node seed.js</code> first.</span>
              }
            </div>
            <div class="form-group">
              <label>Stock Quantity</label>
              <input type="number" [(ngModel)]="pf.stock" placeholder="100" min="0" />
            </div>
            <div class="form-group full">
              <label>Image URL</label>
              <input type="url" [(ngModel)]="pf.image_url" placeholder="https://images.unsplash.com/…" />
              @if (pf.image_url) {
                <img [src]="pf.image_url" class="img-preview" alt="preview" />
              }
            </div>
            <div class="form-group">
              <label>Sizes <span class="hint">comma separated</span></label>
              <input type="text" [(ngModel)]="pf.sizes" placeholder="XS,S,M,L,XL" />
            </div>
            <div class="form-group">
              <label>Colors <span class="hint">comma separated</span></label>
              <input type="text" [(ngModel)]="pf.colors" placeholder="Red,Blue,Black" />
            </div>
            <div class="form-group check-group">
              <label><input type="checkbox" [(ngModel)]="pf.is_featured" /> Mark as Featured</label>
            </div>
            <div class="form-group check-group">
              <label><input type="checkbox" [(ngModel)]="pf.is_new" /> Mark as New Arrival</label>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" (click)="closeProductForm()">Cancel</button>
            <button class="btn-save" (click)="saveProduct()" [disabled]="saving">
              {{ saving ? 'Saving…' : (editingProductId ? 'Update Product' : 'Add Product') }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- CATEGORY FORM MODAL -->
    @if (showCategoryForm) {
      <div class="overlay" (click)="showCategoryForm = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <button class="modal-x" (click)="showCategoryForm = false">✕</button>
          <h2>{{ editingCategoryId ? 'Edit Category' : 'Add Category' }}</h2>
          @if (formError) { <div class="form-error">{{ formError }}</div> }
          <div class="form-group"><label>Category Name *</label><input type="text" [(ngModel)]="cf.name" placeholder="e.g. Casuals" /></div>
          <div class="form-group"><label>Description</label><textarea [(ngModel)]="cf.description" rows="3" placeholder="Short description…"></textarea></div>
          <div class="form-group">
            <label>Image URL</label>
            <input type="url" [(ngModel)]="cf.image_url" placeholder="https://images.unsplash.com/…" />
            @if (cf.image_url) { <img [src]="cf.image_url" class="img-preview" alt="preview" /> }
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" (click)="showCategoryForm = false">Cancel</button>
            <button class="btn-save" (click)="saveCategory()" [disabled]="saving">
              {{ saving ? 'Saving…' : (editingCategoryId ? 'Update' : 'Add') + ' Category' }}
            </button>
          </div>
        </div>
      </div>
    }

    @if (toast) { <div class="toast" [class.toast-err]="toastErr">{{ toast }}</div> }
  `,
  styles: [`
    :host { --brown:#8B6847; --ink:#4A3728; --beige:#F5EFE6; display:block; font-family:'Jost',sans-serif; }
    .admin-page { min-height:100vh; background:#F5EFE6; }
    .admin-header { background:linear-gradient(135deg,#4A3728,#6B4F33); color:white; padding:40px 32px; }
    .admin-header h1 { font-family:'Cormorant Garamond',Georgia,serif; font-size:1.8rem; margin-bottom:6px; }
    .admin-header p { opacity:0.7; font-size:0.9rem; }
    .stats-bar { display:flex; gap:16px; padding:24px 32px; background:white; box-shadow:0 2px 8px rgba(0,0,0,0.05); flex-wrap:wrap; }
    .stat-card { display:flex; align-items:center; gap:14px; flex:1; min-width:140px; background:#FAF6F0; padding:16px 20px; border-radius:10px; }
    .stat-icon { font-size:1.8rem; }
    .stat-card div { display:flex; flex-direction:column; }
    .stat-card strong { font-size:1.4rem; color:var(--ink); line-height:1; }
    .stat-card span { font-size:0.78rem; color:#888; margin-top:2px; }
    .admin-body { max-width:1200px; margin:0 auto; padding:28px 32px; }
    .tabs { display:flex; background:white; border-radius:10px; overflow:hidden; margin-bottom:22px; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
    .tabs button { flex:1; padding:14px; border:none; background:white; cursor:pointer; font-size:0.92rem; color:#888; font-weight:500; transition:all 0.2s; border-bottom:3px solid transparent; font-family:'Jost',sans-serif; }
    .tabs button.active { color:var(--brown); border-bottom-color:var(--brown); background:#FAF6F0; font-weight:700; }
    .tab-content { background:white; border-radius:12px; padding:24px; box-shadow:0 2px 12px rgba(0,0,0,0.06); }
    .tab-toolbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    .tab-toolbar h2 { font-family:'Cormorant Garamond',Georgia,serif; color:var(--ink); font-size:1.4rem; }
    .btn-add { padding:9px 20px; background:var(--brown); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.88rem; transition:background 0.2s; font-family:'Jost',sans-serif; }
    .btn-add:hover { background:#6B4F33; }
    .seed-warning { background:#fff8e1; border:1px solid #ffe082; border-radius:8px; padding:14px 18px; margin-bottom:20px; font-size:0.88rem; color:#7a5c00; line-height:1.6; }
    .seed-warning code { background:#ffefc0; padding:2px 6px; border-radius:4px; font-size:0.85rem; }
    .data-table { overflow-x:auto; }
    table { width:100%; border-collapse:collapse; }
    th { text-align:left; padding:11px 14px; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px; color:#999; border-bottom:2px solid #EDE3D4; }
    td { padding:11px 14px; border-bottom:1px solid #FAF6F0; font-size:0.88rem; color:#444; vertical-align:middle; }
    .table-img { width:48px; height:48px; object-fit:cover; border-radius:8px; }
    .name-cell { font-weight:600; color:var(--ink); max-width:180px; }
    .order-id { font-family:monospace; color:var(--brown); font-weight:600; }
    .actions-cell { display:flex; gap:8px; }
    .empty-row { text-align:center; color:#bbb; padding:40px; font-size:0.9rem; }
    .badge { padding:3px 10px; border-radius:20px; font-size:0.72rem; font-weight:600; }
    .badge-featured { background:#fff3cd; color:#856404; }
    .badge-new { background:#d1ecf1; color:#0c5460; }
    .badge-none { background:#f8f9fa; color:#ccc; }
    .btn-edit   { padding:6px 14px; background:#e8f0fe; color:#1a73e8; border:none; border-radius:6px; cursor:pointer; font-size:0.8rem; font-weight:600; font-family:'Jost',sans-serif; }
    .btn-edit:hover { background:#d2e3fc; }
    .btn-delete { padding:6px 14px; background:#fce8e6; color:#d93025; border:none; border-radius:6px; cursor:pointer; font-size:0.8rem; font-weight:600; font-family:'Jost',sans-serif; }
    .btn-delete:hover { background:#fad2cf; }
    .categories-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
    .cat-admin-card { border:1px solid #E8DDD0; border-radius:10px; overflow:hidden; transition:box-shadow 0.2s; }
    .cat-admin-card:hover { box-shadow:0 4px 16px rgba(0,0,0,0.08); }
    .cat-admin-card img { width:100%; height:110px; object-fit:cover; display:block; }
    .cat-admin-info { padding:12px 14px; }
    .cat-admin-info h3 { font-size:0.95rem; color:var(--ink); margin-bottom:4px; font-weight:600; }
    .cat-admin-info p { font-size:0.8rem; color:#888; line-height:1.4; }
    .cat-admin-actions { padding:10px 14px; border-top:1px solid #FAF6F0; display:flex; gap:8px; }
    .status-badge { padding:4px 12px; border-radius:20px; font-size:0.72rem; font-weight:600; text-transform:capitalize; }
    .status-pending    { background:#fff3cd; color:#856404; }
    .status-processing { background:#cce5ff; color:#004085; }
    .status-shipped    { background:#d4edda; color:#155724; }
    .status-delivered  { background:#d1f2eb; color:#0e6655; }
    .status-cancelled  { background:#f8d7da; color:#721c24; }
    .status-select { padding:5px 8px; border:1px solid #ddd; border-radius:6px; font-size:0.8rem; font-family:'Jost',sans-serif; }
    .loading-state { text-align:center; padding:50px; color:#999; }
    .spinner { width:34px; height:34px; border:3px solid #E8DDD0; border-top:3px solid var(--brown); border-radius:50%; animation:spin 0.9s linear infinite; margin:0 auto 12px; }
    @keyframes spin { to{transform:rotate(360deg);} }
    /* MODAL */
    .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:10000; padding:20px; }
    .modal { background:white; border-radius:14px; padding:32px; width:100%; max-width:500px; max-height:92vh; overflow-y:auto; position:relative; }
    .large-modal { max-width:720px; }
    .modal-x { position:absolute; top:14px; right:18px; background:none; border:none; font-size:1.1rem; color:#aaa; cursor:pointer; }
    .modal h2 { font-family:'Cormorant Garamond',Georgia,serif; color:var(--ink); margin:0 0 20px; font-size:1.5rem; }
    .form-error { background:#fce8e6; color:#d93025; padding:10px 14px; border-radius:8px; font-size:0.88rem; margin-bottom:16px; border-left:3px solid #d93025; }
    .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .form-group { display:flex; flex-direction:column; gap:5px; }
    .form-group.full { grid-column:1 / -1; }
    .form-group.check-group { flex-direction:row; align-items:center; padding-top:20px; }
    .form-group label { font-size:0.82rem; font-weight:600; color:#555; }
    .hint { font-weight:400; color:#aaa; font-size:0.76rem; }
    .field-hint-err { font-size:0.78rem; color:#d93025; margin-top:3px; }
    .field-hint-err code { background:#fce8e6; padding:1px 5px; border-radius:3px; }
    .form-group input[type=text],.form-group input[type=number],.form-group input[type=url],.form-group select,.form-group textarea { padding:9px 12px; border:1.5px solid #E8DDD0; border-radius:8px; font-size:0.88rem; outline:none; font-family:'Jost',sans-serif; transition:border-color 0.2s; width:100%; box-sizing:border-box; }
    .form-group input:focus,.form-group select:focus,.form-group textarea:focus { border-color:var(--brown); }
    .form-group input[type=checkbox] { width:auto; cursor:pointer; accent-color:var(--brown); }
    .form-group select { background:white; cursor:pointer; }
    .img-preview { margin-top:8px; width:100%; max-height:140px; object-fit:cover; border-radius:8px; border:1px solid #E8DDD0; }
    .modal-actions { display:flex; gap:12px; justify-content:flex-end; margin-top:22px; padding-top:16px; border-top:1px solid #EDE3D4; }
    .btn-cancel { padding:10px 22px; background:#f5f5f5; color:#666; border:none; border-radius:8px; cursor:pointer; font-weight:600; font-family:'Jost',sans-serif; }
    .btn-save { padding:10px 26px; background:var(--brown); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:700; font-family:'Jost',sans-serif; transition:background 0.2s; }
    .btn-save:hover:not(:disabled) { background:#6B4F33; }
    .btn-save:disabled { opacity:0.65; cursor:not-allowed; }
    .toast { position:fixed; bottom:28px; right:28px; background:var(--ink); color:white; padding:12px 22px; border-radius:8px; font-size:0.88rem; z-index:99999; animation:fadeUp 0.3s ease; }
    .toast.toast-err { background:#c0392b; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;} }
    @media(max-width:768px) { .categories-grid{grid-template-columns:1fr;} .form-grid{grid-template-columns:1fr;} .admin-body{padding:20px;} .stats-bar{padding:16px 20px;} }
  `]
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  orders: any[] = [];
  activeTab = 'products';
  loading = false;
  saving = false;
  showProductForm = false;
  showCategoryForm = false;
  editingProductId: string | null = null;
  editingCategoryId: string | null = null;
  toast = ''; toastErr = false;
  formError = '';

  pf = this.emptyPF();
  cf = { name:'', description:'', image_url:'' };

  get featuredCount() { return this.products.filter(p => p.is_featured).length; }
  get newCount()      { return this.products.filter(p => p.is_new).length; }

  constructor(private productService: ProductService) {}

  ngOnInit() { this.loadProducts(); this.loadCategories(); }

  emptyPF() {
    return { name:'', description:'', price:0, original_price:null as number|null, category_id:'', image_url:'', sizes:'XS,S,M,L,XL', colors:'', stock:100, is_featured:false, is_new:false };
  }

  setTab(t: string) { this.activeTab = t; if (t === 'orders') this.loadOrders(); }
  getVal(e: Event) { return (e.target as HTMLSelectElement).value; }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: res => { if (res.success) this.products = res.data; this.loading = false; },
      error: () => { this.loading = false; this.showToast('Failed to load products. Is backend running?', true); }
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: res => { if (res.success) this.categories = res.data; },
      error: () => this.showToast('Could not load categories. Is backend running?', true)
    });
  }

  loadOrders() {
    fetch(`${environment.apiUrl}/orders`)
      .then(r => r.json())
      .then(res => { if (res.success) this.orders = res.data; })
      .catch(() => this.showToast('Failed to load orders', true));
  }

  // ── PRODUCTS ──────────────────────────────────────────────────────
  openProductForm() {
    // Reload categories every time form opens to make sure dropdown is fresh
    this.loadCategories();
    this.editingProductId = null;
    this.pf = this.emptyPF();
    this.formError = '';
    this.showProductForm = true;
  }

  editProduct(product: Product) {
    this.loadCategories();
    this.editingProductId = (product._id || product.id) as string;
    this.pf = {
      name:           product.name,
      description:    product.description || '',
      price:          product.price,
      original_price: product.original_price ?? null,
      category_id:    (product.category_id || '') as string,
      image_url:      product.image_url || '',
      sizes:          product.sizes || 'XS,S,M,L,XL',
      colors:         product.colors || '',
      stock:          product.stock ?? 100,
      is_featured:    product.is_featured,
      is_new:         product.is_new
    };
    this.formError = '';
    this.showProductForm = true;
  }

  closeProductForm() { this.showProductForm = false; this.editingProductId = null; this.formError = ''; }

  saveProduct() {
    this.formError = '';
    if (!this.pf.name?.trim())        { this.formError = 'Product name is required.'; return; }
    if (!this.pf.price || +this.pf.price <= 0) { this.formError = 'A valid price is required.'; return; }
    if (!this.pf.category_id)         { this.formError = 'Please select a category.'; return; }

    this.saving = true;
    const payload: any = {
      name:           this.pf.name.trim(),
      description:    this.pf.description || '',
      price:          +this.pf.price,
      original_price: this.pf.original_price ? +this.pf.original_price : null,
      category_id:    this.pf.category_id,
      image_url:      this.pf.image_url || '',
      sizes:          this.pf.sizes || 'XS,S,M,L,XL',
      colors:         this.pf.colors || '',
      stock:          +this.pf.stock || 100,
      is_featured:    !!this.pf.is_featured,
      is_new:         !!this.pf.is_new,
    };

    const action = this.editingProductId
      ? this.productService.updateProduct(this.editingProductId, payload)
      : this.productService.createProduct(payload);

    action.subscribe({
      next: res => {
        if (res.success) {
          this.showToast(this.editingProductId ? '✅ Product updated!' : '✅ Product added!');
          this.closeProductForm();
          this.loadProducts();
        } else {
          this.formError = 'Save failed. Please try again.';
        }
        this.saving = false;
      },
      error: err => {
        this.formError = 'Error: ' + (err?.error?.message || 'Could not save. Is backend running?');
        this.saving = false;
      }
    });
  }

  deleteProduct(id: string) {
    if (!id || !confirm('Delete this product?')) return;
    this.productService.deleteProduct(id).subscribe({
      next: res => { if (res.success) { this.products = this.products.filter(p => (p._id || p.id) !== id); this.showToast('Product deleted'); } },
      error: () => this.showToast('Delete failed', true)
    });
  }

  // ── CATEGORIES ────────────────────────────────────────────────────
  openCategoryForm() {
    this.editingCategoryId = null;
    this.cf = { name:'', description:'', image_url:'' };
    this.formError = '';
    this.showCategoryForm = true;
  }

  editCategory(cat: Category) {
    this.editingCategoryId = (cat._id || cat.id) as string;
    this.cf = { name: cat.name, description: cat.description || '', image_url: cat.image_url || '' };
    this.formError = '';
    this.showCategoryForm = true;
  }

  saveCategory() {
    this.formError = '';
    if (!this.cf.name?.trim()) { this.formError = 'Category name is required.'; return; }
    this.saving = true;
    const payload = { name: this.cf.name.trim(), description: this.cf.description || '', image_url: this.cf.image_url || '' };
    const action = this.editingCategoryId
      ? this.productService.updateCategory(this.editingCategoryId, payload as Category)
      : this.productService.createCategory(payload as Category);
    action.subscribe({
      next: res => {
        if (res.success) { this.showToast('✅ Category saved!'); this.showCategoryForm = false; this.loadCategories(); }
        else { this.formError = 'Save failed.'; }
        this.saving = false;
      },
      error: err => { this.formError = 'Error: ' + (err?.error?.message || 'Could not save category.'); this.saving = false; }
    });
  }

  deleteCategory(id: string) {
    if (!id || !confirm('Delete this category?')) return;
    this.productService.deleteCategory(id).subscribe({
      next: () => { this.categories = this.categories.filter(c => (c._id || c.id) !== id); this.showToast('Category deleted'); },
      error: () => this.showToast('Delete failed', true)
    });
  }

  // ── ORDERS ────────────────────────────────────────────────────────
  updateOrderStatus(orderId: string, status: string) {
    fetch(`${environment.apiUrl}/orders/${orderId}/status`, {
      method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status })
    }).then(r => r.json())
      .then((res: any) => { if (res.success) this.showToast('Order updated to: ' + status); })
      .catch(() => this.showToast('Update failed', true));
  }

  showToast(msg: string, err = false) { this.toast = msg; this.toastErr = err; setTimeout(() => this.toast = '', 3500); }
}
