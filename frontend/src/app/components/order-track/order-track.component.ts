import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ReceiptService } from '../../services/receipt.service';

@Component({
  selector: 'app-order-track',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="track-page">
      <div class="track-wrap">
        <div class="track-header">
          <h1>Track Your Order</h1>
          <p>Enter your Order ID to see the latest status</p>
        </div>

        <div class="search-bar">
          <input
            type="text"
            [(ngModel)]="orderId"
            placeholder="Paste your Order ID here…"
            (keydown.enter)="track()"
          />
          <button (click)="track()" [disabled]="loading || !orderId.trim()">
            {{ loading ? 'Searching…' : 'Track →' }}
          </button>
        </div>

        @if (error) {
          <div class="error-box">{{ error }}</div>
        }

        @if (order) {
          <div class="order-card">
            <!-- Header -->
            <div class="order-meta">
              <div>
                <span class="meta-label">Order ID</span>
                <span class="meta-val mono">#{{ getShortId(order._id) }}</span>
              </div>
              <div>
                <span class="meta-label">Placed On</span>
                <span class="meta-val">{{ order.createdAt | date:'dd MMM yyyy, h:mm a' }}</span>
              </div>
              <div>
                <span class="meta-label">Total</span>
                <span class="meta-val">₹{{ order.total_amount | number:'1.0-0' }}</span>
              </div>
              <div>
                <span class="status-pill" [ngClass]="'s-' + order.status">{{ order.status | titlecase }}</span>
              </div>
              <button (click)="receiptService.generateReceipt(order)" class="btn-receipt-track">📄 Download Receipt</button>
            </div>

            <!-- Status Timeline -->
            <div class="timeline-section">
              <h3>Order Progress</h3>
              <div class="timeline">
                @for (step of steps; track step.key) {
                  <div class="tl-step" [class.done]="isDone(step.key)" [class.active]="isActive(step.key)" [class.cancelled]="order.status === 'cancelled'">
                    <div class="tl-dot">
                      @if (isDone(step.key) && order.status !== 'cancelled') { <span class="check">✓</span> }
                      @else if (order.status === 'cancelled' && step.key === 'cancelled') { <span class="x">✕</span> }
                      @else { <span class="num">{{ step.num }}</span> }
                    </div>
                    <div class="tl-line" [class.filled]="isDone(step.key) && !isLast(step.key)"></div>
                    <div class="tl-label">
                      <strong>{{ step.label }}</strong>
                      <span>{{ step.desc }}</span>
                      @if (getHistoryDate(step.key)) {
                        <em>{{ getHistoryDate(step.key) | date:'dd MMM, h:mm a' }}</em>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Items -->
            <div class="items-section">
              <h3>Items Ordered</h3>
              <div class="items-list">
                @for (item of order.items; track item.product_id) {
                  <div class="order-item">
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-detail">
                      Qty: {{ item.quantity }}
                      @if (item.size) { · Size: {{ item.size }} }
                    </span>
                    <span class="item-price">₹{{ ((item.price ?? 0) * item.quantity) | number:'1.0-0' }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Shipping -->
            <div class="shipping-section">
              <h3>Shipping To</h3>
              <p><strong>{{ order.customer_name }}</strong></p>
              <p>{{ order.shipping_address }}</p>
              @if (order.customer_phone) { <p>📞 {{ order.customer_phone }}</p> }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { --brown:#8B6847; --brown-dark:#6B4F33; --beige:#F5EFE6; --beige-border:#E8DDD0; --ink:#4A3728; display:block; font-family:'Jost',sans-serif; background:var(--beige); min-height:100vh; }
    .track-page { padding:60px 20px; }
    .track-wrap { max-width:760px; margin:0 auto; }
    .track-header { text-align:center; margin-bottom:36px; }
    .track-header h1 { font-family:'Cormorant Garamond',Georgia,serif; font-size:2.2rem; color:var(--ink); margin:0 0 8px; }
    .track-header p { color:#9C8877; font-size:0.92rem; }
    .search-bar { display:flex; gap:10px; margin-bottom:24px; }
    .search-bar input { flex:1; padding:12px 16px; border:1.5px solid var(--beige-border); border-radius:8px; font-size:0.92rem; outline:none; font-family:inherit; }
    .search-bar input:focus { border-color:var(--brown); }
    .search-bar button { padding:12px 28px; background:var(--brown); color:white; border:none; border-radius:8px; font-weight:700; cursor:pointer; font-family:inherit; transition:background 0.2s; white-space:nowrap; }
    .search-bar button:hover:not(:disabled) { background:var(--brown-dark); }
    .search-bar button:disabled { opacity:0.6; cursor:not-allowed; }
    .error-box { background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:12px 18px; border-radius:8px; font-size:0.88rem; margin-bottom:20px; text-align:center; }
    .order-card { background:white; border-radius:14px; box-shadow:0 4px 24px rgba(0,0,0,0.07); overflow:hidden; }
    /* Meta */
    .order-meta { display:flex; flex-wrap:wrap; gap:20px; padding:24px 28px; background:#FAF6F0; border-bottom:1px solid var(--beige-border); align-items:center; }
    .order-meta > div { display:flex; flex-direction:column; gap:3px; }
    .meta-label { font-size:0.7rem; text-transform:uppercase; letter-spacing:1px; color:#9C8877; font-weight:600; }
    .meta-val { font-size:0.9rem; color:var(--ink); font-weight:600; }
    .meta-val.mono { font-family:monospace; color:var(--brown); }
    .status-pill { padding:5px 16px; border-radius:20px; font-size:0.78rem; font-weight:700; letter-spacing:0.5px; text-transform:capitalize; }
    .s-pending    { background:#fff3cd; color:#856404; }
    .s-processing { background:#cce5ff; color:#004085; }
    .s-shipped    { background:#d4edda; color:#155724; }
    .s-delivered  { background:#d1f2eb; color:#0e6655; }
    .s-cancelled  { background:#f8d7da; color:#721c24; }
    /* Timeline */
    .timeline-section { padding:28px 28px 0; }
    .timeline-section h3, .items-section h3, .shipping-section h3 { font-family:'Cormorant Garamond',Georgia,serif; font-size:1.15rem; color:var(--ink); margin:0 0 20px; }
    .timeline { display:flex; flex-direction:column; gap:0; padding-left:8px; }
    .tl-step { display:grid; grid-template-columns:32px 2px 1fr; gap:0 14px; min-height:64px; }
    .tl-dot { width:32px; height:32px; border-radius:50%; border:2.5px solid #E8DDD0; background:white; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:0.78rem; color:#ccc; font-weight:700; transition:all 0.3s; }
    .tl-step.done .tl-dot  { background:var(--brown); border-color:var(--brown); color:white; }
    .tl-step.active .tl-dot { border-color:var(--brown); color:var(--brown); animation:pulse 1.5s ease-in-out infinite; }
    .tl-step.cancelled .tl-dot { background:#c0392b; border-color:#c0392b; color:white; }
    @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(139,104,71,0.4);}50%{box-shadow:0 0 0 6px rgba(139,104,71,0);} }
    .tl-line { width:2px; min-height:32px; background:#E8DDD0; margin:0 auto; transition:background 0.3s; }
    .tl-line.filled { background:var(--brown); }
    .tl-label { padding:4px 0 20px; }
    .tl-label strong { display:block; font-size:0.9rem; color:var(--ink); margin-bottom:2px; }
    .tl-label span { font-size:0.78rem; color:#9C8877; display:block; }
    .tl-label em { font-size:0.74rem; color:var(--brown); font-style:normal; display:block; margin-top:3px; }
    .check { font-size:0.85rem; }
    .x { font-size:0.85rem; }
    .num { font-size:0.78rem; }
    /* Items */
    .items-section { padding:24px 28px; border-top:1px solid #FAF6F0; }
    .items-list { display:flex; flex-direction:column; gap:10px; }
    .order-item { display:flex; align-items:center; gap:12px; padding:12px 16px; background:#FAF6F0; border-radius:8px; }
    .item-name { flex:1; font-size:0.88rem; font-weight:600; color:var(--ink); }
    .item-detail { font-size:0.78rem; color:#9C8877; }
    .item-price { font-size:0.9rem; font-weight:700; color:var(--brown); flex-shrink:0; }
    /* Shipping */
    .shipping-section { padding:20px 28px 28px; border-top:1px solid #FAF6F0; }
    .shipping-section p { font-size:0.88rem; color:#555; margin:3px 0; }
    .tl-label em { font-size:0.74rem; color:var(--brown); font-style:normal; display:block; margin-top:3px; }
    .btn-receipt-track { padding:8px 16px; border:none; background:var(--brown); color:white; border-radius:8px; cursor:pointer; font-size:0.8rem; font-weight:700; transition:all 0.2s; margin-left:auto; }
    .btn-receipt-track:hover { background:var(--brown-dark); }
    @media(max-width:600px) { .order-meta { flex-direction:column; gap:12px; } .tl-step { grid-template-columns:28px 2px 1fr; } .btn-receipt-track { width:100%; margin:0; } }
  `]
})
export class OrderTrackComponent implements OnInit {
  orderId = '';
  loading = false;
  error = '';
  order: any = null;

  steps = [
    { num: 1, key: 'pending',    label: 'Order Placed',   desc: 'We received your order' },
    { num: 2, key: 'processing', label: 'Processing',     desc: 'Your order is being prepared' },
    { num: 3, key: 'shipped',    label: 'Shipped',        desc: 'On its way to you!' },
    { num: 4, key: 'delivered',  label: 'Delivered',      desc: 'Enjoy your new style!' },
  ];

  statusOrder = ['pending', 'processing', 'shipped', 'delivered'];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public receiptService: ReceiptService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderId = id;
    }
  }

  getShortId(id: any): string {
    return id ? String(id).slice(0, 8).toUpperCase() : '';
  }

  track() {
    let id = this.orderId.trim().replace('#', '');
    if (!id) return;
    this.loading = true;
    this.error = '';
    this.order = null;
    this.http.get<any>(`${environment.apiUrl}/orders/track/${id}`).subscribe({
      next: res => {
        if (res.success) { this.order = res.data; }
        else { this.error = 'Order not found. Please check the ID.'; }
        this.loading = false;
      },
      error: () => {
        this.error = 'Order not found. Please check your Order ID.';
        this.loading = false;
      }
    });
  }

  isDone(key: string): boolean {
    if (!this.order) return false;
    const curr = this.statusOrder.indexOf(this.order.status);
    const step = this.statusOrder.indexOf(key);
    return step <= curr;
  }

  isActive(key: string): boolean {
    return this.order?.status === key;
  }

  isLast(key: string): boolean {
    return key === 'delivered';
  }

  getHistoryDate(status: string): Date | null {
    if (!this.order?.statusHistory) return null;
    const entry = [...this.order.statusHistory].reverse().find((h: any) => h.status === status);
    return entry ? new Date(entry.updatedAt) : null;
  }
}
