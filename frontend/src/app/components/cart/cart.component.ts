import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ReceiptService } from '../../services/receipt.service';
import { environment } from '../../../environments/environment';
import { CartItem, ApiResponse } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page">
      <div class="wrap">
        <div class="page-header">
          <div>
            <h1>Your Bag</h1>
            <p>{{ totalItems }} item{{ totalItems !== 1 ? 's' : '' }}</p>
          </div>
          <a routerLink="/products" class="back-link">← Continue Shopping</a>
        </div>

        @if (loading) {
          <div class="center-state"><div class="spin"></div><p>Loading bag…</p></div>
        }

        @if (!loading) {
          <div class="cart-layout">
            <div class="items-col">
              @if (cartItems.length === 0) {
                <div class="empty-state">
                  <div class="empty-icon">🛍️</div>
                  <h2>Your bag is empty</h2>
                  <p>Add some gorgeous pieces!</p>
                  <a routerLink="/products" class="btn-primary">Browse Products</a>
                </div>
              } @else {
                @for (item of cartItems; track item.id) {
                  <div class="cart-item">
                    <img [src]="item.image_url || 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80'" [alt]="item.name" />
                    <div class="item-info">
                      <h3>{{ item.name }}</h3>
                      <p class="item-sub">
                        @if (item.size) { <span>Size: {{ item.size }}</span> }
                        @if (item.color) { <span> · {{ item.color }}</span> }
                      </p>
                      <span class="item-price">₹{{ item.price | number:'1.0-0' }}</span>
                    </div>
                    <div class="qty-control">
                      <button (click)="dec(item)">−</button>
                      <span>{{ item.quantity }}</span>
                      <button (click)="inc(item)">+</button>
                    </div>
                    <span class="item-total">₹{{ ((item.price ?? 0) * item.quantity) | number:'1.0-0' }}</span>
                    <button class="remove-btn" (click)="remove(item.id ?? '')" title="Remove">✕</button>
                  </div>
                }
                <button class="clear-all-btn" (click)="clearCart()">🗑 Clear Entire Bag</button>
              }
            </div>

            <div class="summary-col">
              <h2>Order Summary</h2>
              @if (cartItems.length > 0) {
                <div class="summary-items">
                  @for (item of cartItems; track item.id) {
                    <div class="si-row">
                      <img [src]="item.image_url || 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=60&q=80'" [alt]="item.name" class="si-img" />
                      <div class="si-info">
                        <span class="si-name">{{ item.name }}</span>
                        <span class="si-meta">Qty: {{ item.quantity }}{{ item.size ? ' · ' + item.size : '' }}</span>
                      </div>
                      <span class="si-price">₹{{ ((item.price ?? 0) * item.quantity) | number:'1.0-0' }}</span>
                    </div>
                  }
                </div>
                <div class="divider"></div>
              }
              <div class="sum-row"><span>Subtotal ({{ totalItems }} items)</span><strong>₹{{ subtotal | number:'1.0-0' }}</strong></div>
              <div class="sum-row"><span>Delivery</span><strong [class.free]="subtotal >= 999">{{ subtotal >= 999 ? 'FREE' : '₹99' }}</strong></div>
              @if (subtotal >= 999) { <p class="free-note">🎉 Free delivery applied!</p> }
              <div class="divider"></div>
              <div class="sum-row total"><span>Total</span><strong>₹{{ totalAmt | number:'1.0-0' }}</strong></div>
              <button class="btn-checkout" (click)="showCheckout = true" [disabled]="cartItems.length === 0">Proceed to Checkout →</button>
            </div>
          </div>
        }
      </div>
    </div>

    @if (showCheckout) {
      <div class="overlay" (click)="showCheckout = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <button class="modal-x" (click)="showCheckout = false">✕</button>
          <h2>Complete Your Order</h2>
          <div class="checkout-summary">
            @for (item of cartItems; track item.id) {
              <div class="cs-item-row">
                <span class="cs-item-name">{{ item.name }} <em>x{{ item.quantity }}</em></span>
                <span>₹{{ ((item.price ?? 0) * item.quantity) | number:'1.0-0' }}</span>
              </div>
            }
            <div class="cs-divider"></div>
            <div class="cs-row"><span>Subtotal</span><strong>₹{{ subtotal | number:'1.0-0' }}</strong></div>
            <div class="cs-row"><span>Delivery</span><strong [class.free]="subtotal >= 999">{{ subtotal >= 999 ? 'FREE' : '₹99' }}</strong></div>
            <div class="cs-divider"></div>
            <div class="cs-row total"><span>Total Payable</span><strong>₹{{ totalAmt | number:'1.0-0' }}</strong></div>
          </div>
          <div class="field"><label>Full Name *</label><input [(ngModel)]="order.customer_name" placeholder="Your name" /></div>
          <div class="field"><label>Email *</label><input type="email" [(ngModel)]="order.customer_email" placeholder="email@example.com" /></div>
          <div class="field"><label>Phone</label><input type="tel" [(ngModel)]="order.customer_phone" placeholder="+91 9999999999" /></div>
          <div class="field"><label>Delivery Address *</label><textarea [(ngModel)]="order.shipping_address" rows="3" placeholder="Street, City, PIN"></textarea></div>
          <button class="btn-place" (click)="placeOrder()" [disabled]="placing">{{ placing ? 'Placing…' : 'Place Order ✓' }}</button>
        </div>
      </div>
    }

    @if (toast) { <div class="toast" [class.err]="toastErr">{{ toast }}</div> }

    <!-- ORDER CONFIRMED SCREEN -->
    @if (placedOrderId) {
      <div class="overlay">
        <div class="modal confirmed-modal">
          <div class="confirmed-icon">🎉</div>
          <h2>Order Confirmed!</h2>
          <p>Your order has been placed successfully.</p>
          <div class="order-ref">
            <span>Order ID</span>
            <code>{{ placedOrderId }}</code>
          </div>
          <p class="track-hint">Save your Order ID to track delivery status.</p>
          <button (click)="downloadReceipt()" class="btn-receipt-success">📄 Download Receipt</button>
          <a [routerLink]="['/track', placedOrderId]" class="btn-track">Track My Order →</a>
          <button class="btn-continue" (click)="placedOrderId = ''" routerLink="/products">Continue Shopping</button>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { --brown:#8B6847; --brown-dark:#6B4F33; --brown-light:#C4A882; --beige:#F5EFE6; --beige-card:#FAF6F0; --beige-border:#E8DDD0; --ink:#4A3728; --muted:#9C8877; display:block; font-family:'Jost',sans-serif; background:var(--beige); min-height:100vh; }
    .page { padding:40px 20px; }
    .wrap { max-width:1100px; margin:0 auto; }
    .page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; }
    .page-header h1 { font-family:'Cormorant Garamond',Georgia,serif; font-size:2rem; color:var(--ink); margin:0 0 4px; }
    .page-header p { color:#888; font-size:0.88rem; margin:0; }
    .back-link { color:var(--brown); text-decoration:none; font-size:0.88rem; }
    .center-state,.empty-state { text-align:center; padding:80px 20px; }
    .spin { width:36px; height:36px; border:3px solid #E8DDD0; border-top:3px solid var(--brown); border-radius:50%; animation:spin 0.9s linear infinite; margin:0 auto 14px; }
    @keyframes spin { to{transform:rotate(360deg);} }
    .empty-icon { font-size:3.5rem; margin-bottom:16px; }
    .empty-state h2 { font-family:'Cormorant Garamond',Georgia,serif; color:var(--ink); margin-bottom:8px; }
    .empty-state p { color:#888; margin-bottom:24px; }
    .btn-primary { display:inline-block; padding:13px 32px; background:var(--brown); color:white; border-radius:8px; text-decoration:none; font-weight:600; }
    .cart-layout { display:grid; grid-template-columns:1fr 320px; gap:28px; align-items:start; }
    .items-col { display:flex; flex-direction:column; gap:12px; }
    .cart-item { background:white; border-radius:12px; padding:16px; display:flex; align-items:center; gap:14px; box-shadow:0 2px 10px rgba(0,0,0,0.05); }
    .cart-item img { width:76px; height:76px; object-fit:cover; border-radius:8px; flex-shrink:0; }
    .item-info { flex:1; min-width:0; }
    .item-info h3 { font-size:0.92rem; color:var(--ink); font-weight:600; margin:0 0 4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .item-sub { font-size:0.78rem; color:#999; margin:0 0 6px; }
    .item-price { font-size:0.9rem; color:var(--brown); font-weight:600; }
    .qty-control { display:flex; align-items:center; border:1.5px solid #E8DDD0; border-radius:8px; overflow:hidden; flex-shrink:0; }
    .qty-control button { width:30px; height:30px; border:none; background:#FAF6F0; cursor:pointer; font-size:1rem; color:#555; transition:background 0.2s; }
    .qty-control button:hover { background:#F0E8DC; color:var(--brown); }
    .qty-control span { width:32px; text-align:center; font-size:0.88rem; font-weight:600; }
    .item-total { font-weight:700; color:var(--ink); font-size:0.92rem; min-width:70px; text-align:right; flex-shrink:0; }
    .remove-btn { background:none; border:none; color:#ccc; cursor:pointer; font-size:0.9rem; padding:4px 6px; transition:color 0.2s; flex-shrink:0; }
    .remove-btn:hover { color:#e74c3c; }
    .clear-all-btn { background:none; border:1.5px solid #E8DDD0; color:#999; padding:10px 18px; border-radius:8px; cursor:pointer; font-size:0.82rem; transition:all 0.2s; align-self:flex-start; margin-top:4px; }
    .clear-all-btn:hover { border-color:#e74c3c; color:#e74c3c; }
    .summary-col { background:white; border-radius:12px; padding:24px; box-shadow:0 2px 14px rgba(0,0,0,0.06); }
    .summary-col h2 { font-family:'Cormorant Garamond',Georgia,serif; font-size:1.3rem; color:var(--ink); margin:0 0 20px; }
    .sum-row { display:flex; justify-content:space-between; align-items:center; font-size:0.88rem; color:#555; margin-bottom:12px; }
    .sum-row strong { color:var(--ink); }
    .sum-row strong.free { color:#2e7d32; }
    .free-note { font-size:0.8rem; color:#2e7d32; margin:0 0 12px; }
    .divider { border:none; border-top:1px solid #EDE3D4; margin:16px 0; }
    .sum-row.total span,.sum-row.total strong { color:var(--ink); font-size:1.1rem; font-weight:700; }
    .btn-checkout { width:100%; padding:14px; background:var(--brown); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:700; font-size:0.95rem; margin-top:8px; transition:background 0.2s; }
    .btn-checkout:hover:not(:disabled) { background:#6B4F33; }
    .btn-checkout:disabled { opacity:0.4; cursor:not-allowed; }
    /* Summary mini product list */
    .summary-items { display:flex; flex-direction:column; gap:10px; margin-bottom:4px; }
    .si-row { display:flex; align-items:center; gap:10px; }
    .si-img { width:40px; height:40px; object-fit:cover; border-radius:6px; flex-shrink:0; }
    .si-info { flex:1; min-width:0; }
    .si-name { display:block; font-size:0.82rem; font-weight:600; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .si-meta { display:block; font-size:0.72rem; color:#999; }
    .si-price { font-size:0.82rem; font-weight:700; color:var(--brown); flex-shrink:0; }
    /* Checkout modal summary */
    .checkout-summary { background:#FAF6F0; border-radius:10px; padding:16px; margin-bottom:20px; }
    .cs-item-row { display:flex; justify-content:space-between; align-items:center; font-size:0.84rem; color:var(--ink); margin-bottom:8px; }
    .cs-item-name { flex:1; margin-right:10px; }
    .cs-item-name em { font-style:normal; color:#999; font-size:0.78rem; }
    .cs-row { display:flex; justify-content:space-between; font-size:0.85rem; color:#555; margin-bottom:6px; }
    .cs-row.total span,.cs-row.total strong { font-size:1rem; font-weight:700; color:var(--brown); }
    .cs-row strong.free { color:#2e7d32; }
    .cs-divider { border:none; border-top:1px solid #E8DDD0; margin:10px 0; }

    .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:10000; padding:20px; }
    .modal { background:white; border-radius:14px; padding:32px; width:100%; max-width:460px; max-height:90vh; overflow-y:auto; position:relative; }
    .modal-x { position:absolute; top:14px; right:18px; background:none; border:none; font-size:1.1rem; color:#aaa; cursor:pointer; }
    .modal h2 { font-family:'Cormorant Garamond',Georgia,serif; color:var(--ink); margin:0 0 22px; }
    .field { margin-bottom:16px; }
    .field label { display:block; font-size:0.8rem; font-weight:600; color:#666; margin-bottom:5px; }
    .field input,.field textarea { width:100%; padding:10px 13px; border:1.5px solid #E8DDD0; border-radius:8px; font-size:0.88rem; outline:none; box-sizing:border-box; font-family:inherit; }
    .field input:focus,.field textarea:focus { border-color:var(--brown); }
    .order-total { background:#F0E8DC; border-radius:8px; padding:13px; text-align:center; font-size:1.05rem; font-weight:700; color:var(--brown); margin-bottom:16px; }
    .btn-place { width:100%; padding:14px; background:var(--brown); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:700; transition:background 0.2s; }
    .btn-place:hover:not(:disabled) { background:#6B4F33; }
    .btn-place:disabled { opacity:0.65; cursor:not-allowed; }
    .toast { position:fixed; bottom:28px; right:28px; background:var(--ink); color:white; padding:12px 22px; border-radius:8px; font-size:0.88rem; z-index:99999; animation:fadeUp 0.3s ease; }
    .toast.err { background:#c0392b; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;} }
    /* Confirmed modal */
    .confirmed-modal { text-align:center; }
    .confirmed-icon { font-size:3.5rem; margin-bottom:12px; }
    .confirmed-modal h2 { font-family:'Cormorant Garamond',Georgia,serif; color:var(--ink); margin:0 0 8px; }
    .confirmed-modal > p { color:#9C8877; font-size:0.88rem; margin:0 0 20px; }
    .order-ref { background:#FAF6F0; border-radius:10px; padding:16px; margin-bottom:12px; }
    .order-ref span { display:block; font-size:0.72rem; text-transform:uppercase; letter-spacing:1px; color:#9C8877; margin-bottom:6px; }
    .order-ref code { font-size:0.78rem; word-break:break-all; color:var(--brown); font-weight:700; background:none; }
    .track-hint { font-size:0.8rem; color:#9C8877; margin:0 0 20px; }
    .btn-track { display:block; width:100%; padding:13px; background:var(--brown); color:white; border-radius:8px; text-decoration:none; font-weight:700; font-size:0.92rem; margin-bottom:10px; transition:background 0.2s; }
    .btn-track:hover { background:var(--brown-dark); }
    .btn-receipt-success { display:block; width:100%; padding:13px; background:#FAF6F0; color:var(--ink); border:1.5px solid var(--beige-border); border-radius:8px; cursor:pointer; font-weight:700; font-size:0.92rem; margin-bottom:10px; transition:all 0.2s; font-family:inherit; }
    .btn-receipt-success:hover { border-color:var(--brown); color:var(--brown); }
    .btn-continue { display:block; width:100%; padding:11px; background:none; border:1.5px solid var(--beige-border); color:var(--ink); border-radius:8px; cursor:pointer; font-family:inherit; font-size:0.88rem; transition:all 0.2s; }
    .btn-continue:hover { border-color:var(--brown); color:var(--brown); }
    @media(max-width:768px) { .cart-layout { grid-template-columns:1fr; } }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  loading = true;
  showCheckout = false;
  placing = false;
  placedOrderId = '';
  placedOrderFull: any = null;
  toast = ''; toastErr = false;
  order = { customer_name:'', customer_email:'', customer_phone:'', shipping_address:'' };

  constructor(
    private cartService: CartService, 
    private auth: AuthService,
    private receiptService: ReceiptService
  ) {}
  ngOnInit() {
    this.load();
    const user = this.auth.user();
    if (user) {
      this.order.customer_name = user.name;
      this.order.customer_email = user.email;
    }
  }

  load() {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: res => { if (res.success) this.cartItems = res.data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  get totalItems() { return this.cartItems.reduce((s,i) => s + i.quantity, 0); }
  get subtotal()   { return this.cartItems.reduce((s,i) => s + ((i.price ?? 0) * i.quantity), 0); }
  get totalAmt()   { return this.subtotal + (this.subtotal >= 999 ? 0 : 99); }

  inc(item: CartItem) {
    if (!item.id) return;
    this.cartService.updateQuantity(item.id, item.quantity + 1).subscribe({ next: () => item.quantity++ });
  }
  dec(item: CartItem) {
    if (item.quantity <= 1) { this.remove(item.id ?? ''); return; }
    if (!item.id) return;
    this.cartService.updateQuantity(item.id, item.quantity - 1).subscribe({ next: () => item.quantity-- });
  }

  remove(id: string) {
    if (!id) return;
    this.cartService.removeFromCart(id).subscribe({
      next: () => { this.cartItems = this.cartItems.filter(i => i.id !== id); this.showToast('Item removed'); }
    });
  }

  clearCart() {
    if (!confirm('Clear your bag?')) return;
    this.cartService.clearCart().subscribe({ next: () => { this.cartItems = []; this.showToast('Bag cleared'); } });
  }

  placeOrder() {
    if (!this.order.customer_name || !this.order.customer_email || !this.order.shipping_address) {
      this.showToast('Fill all required fields', true); return;
    }
    this.placing = true;
    const payload = {
      ...this.order,
      total_amount: this.totalAmt,
      items: this.cartItems.map(i => ({
        product_id: i.product_id,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
        price: i.price
      }))
    };
    fetch(`${environment.apiUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          this.showCheckout = false;
          this.cartService.clearCart().subscribe();
          this.cartItems = [];
          this.placedOrderId = res.orderId;
          this.placedOrderFull = { ...payload, _id: res.orderId, createdAt: new Date(), status: 'pending' };
        } else {
          this.showToast(res.message || 'Order failed', true);
        }
        this.placing = false;
      })
      .catch(() => { this.showToast('Order failed', true); this.placing = false; });
  }

  downloadReceipt() {
    if (this.placedOrderFull) {
      this.receiptService.generateReceipt(this.placedOrderFull);
    }
  }

  showToast(msg: string, err = false) {
    this.toast = msg; this.toastErr = err;
    setTimeout(() => this.toast = '', 3500);
  }
}
