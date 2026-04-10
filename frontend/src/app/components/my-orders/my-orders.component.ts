import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { ReceiptService } from '../../services/receipt.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="my-orders-page">
      <div class="wrap">
        <div class="header">
          <h1>My Orders</h1>
          <p>Manage and track your recent purchases</p>
        </div>

        @if (loading) {
          <div class="center-state"><div class="spin"></div><p>Loading your orders...</p></div>
        }

        @if (!loading && orders.length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders with us yet.</p>
            <a routerLink="/products" class="btn-primary">Start Shopping</a>
          </div>
        }

        @if (!loading && orders.length > 0) {
          <div class="orders-list">
            @for (order of orders; track order._id) {
              <div class="order-card">
                <div class="order-header">
                  <div class="meta">
                    <span class="label">ORDER ID</span>
                    <span class="val mono">#{{ getShortId(order._id) }}</span>
                  </div>
                  <div class="meta">
                    <span class="label">PLACED ON</span>
                    <span class="val">{{ order.createdAt | date:'dd MMM yyyy' }}</span>
                  </div>
                  <div class="meta">
                    <span class="label">TOTAL</span>
                    <span class="val">₹{{ order.total_amount | number:'1.0-0' }}</span>
                  </div>
                  <div class="status-box">
                    <span class="status-pill" [ngClass]="'s-' + order.status">{{ order.status | titlecase }}</span>
                  </div>
                </div>

                <div class="order-body">
                  <div class="items-preview">
                    @for (item of order.items; track $index) {
                      @if ($index < 3) {
                        <div class="item-chip">
                          {{ item.name }} <span>x{{ item.quantity }}</span>
                        </div>
                      }
                    }
                    @if (order.items.length > 3) {
                      <span class="more">+{{ order.items.length - 3 }} more items</span>
                    }
                  </div>
                  <div class="actions">
                    <button (click)="receiptService.generateReceipt(order)" class="btn-receipt">📄 Download Receipt</button>
                    <a [routerLink]="['/track', order._id]" class="btn-detail">View Details & Track →</a>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { --brown:#8B6847; --brown-dark:#6B4F33; --beige:#F5EFE6; --beige-border:#E8DDD0; --ink:#4A3728; display:block; font-family:'Jost',sans-serif; background:var(--beige); min-height:100vh; }
    .my-orders-page { padding:60px 20px; }
    .wrap { max-width:900px; margin:0 auto; }
    .header { margin-bottom:40px; }
    .header h1 { font-family:'Cormorant Garamond',Georgia,serif; font-size:2.4rem; color:var(--ink); margin:0 0 8px; }
    .header p { color:var(--brown); font-size:1rem; }

    .center-state { text-align:center; padding:80px 20px; }
    .spin { width:36px; height:36px; border:3px solid #E8DDD0; border-top:3px solid var(--brown); border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 16px; }
    @keyframes spin { to{transform:rotate(360deg);} }

    .empty-state { text-align:center; padding:100px 20px; background:white; border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.05); }
    .empty-icon { font-size:4rem; margin-bottom:20px; }
    .btn-primary { display:inline-block; padding:14px 36px; background:var(--brown); color:white; border-radius:10px; text-decoration:none; font-weight:600; margin-top:20px; transition:all 0.2s; }
    .btn-primary:hover { background:var(--brown-dark); transform:translateY(-2px); }

    .orders-list { display:flex; flex-direction:column; gap:20px; }
    .order-card { background:white; border-radius:16px; border:1px solid var(--beige-border); overflow:hidden; transition:transform 0.2s; }
    .order-card:hover { transform:translateY(-4px); box-shadow:0 12px 40px rgba(74,55,40,0.1); }

    .order-header { display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:20px; padding:20px 28px; background:#FAF6F0; border-bottom:1px solid var(--beige-border); align-items:center; }
    .meta { display:flex; flex-direction:column; gap:4px; }
    .label { font-size:0.75rem; font-weight:700; color:#9C8877; letter-spacing:1px; }
    .val { font-size:0.95rem; font-weight:600; color:var(--ink); }
    .val.mono { font-family:'Courier New', monospace; color:var(--brown); }

    .status-pill { padding:6px 14px; border-radius:20px; font-size:0.8rem; font-weight:700; display:inline-block; }
    .s-pending    { background:#fff3cd; color:#856404; }
    .s-processing { background:#cce5ff; color:#004085; }
    .s-shipped    { background:#d4edda; color:#155724; }
    .s-delivered  { background:#d1f2eb; color:#0e6655; }
    .s-cancelled  { background:#f8d7da; color:#721c24; }

    .order-body { padding:24px 28px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px; }
    .items-preview { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
    .item-chip { padding:6px 12px; background:var(--beige); color:var(--ink); border-radius:8px; font-size:0.85rem; font-weight:500; }
    .item-chip span { color:var(--brown); font-weight:700; margin-left:4px; }
    .more { font-size:0.85rem; color:#9c8877; font-weight:500; font-style:italic; }

    .btn-detail { padding:10px 20px; border:1.5px solid var(--brown); color:var(--brown); border-radius:8px; text-decoration:none; font-size:0.9rem; font-weight:600; transition:all 0.2s; }
    .btn-detail:hover { background:var(--brown); color:white; }

    .btn-receipt { padding:10px 20px; border:none; background:var(--beige-border); color:var(--ink); border-radius:8px; cursor:pointer; font-size:0.9rem; font-weight:600; transition:all 0.2s; font-family:inherit; }
    .btn-receipt:hover { background:#DCD0C0; }

    @media(max-width:600px) {
      .order-header { grid-template-columns: 1fr 1fr; }
      .order-body { flex-direction:column; align-items:flex-start; }
      .btn-detail { width:100%; text-align:center; }
    }
  `]
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(
    private http: HttpClient, 
    private auth: AuthService,
    public receiptService: ReceiptService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const headers = this.auth.getAuthHeader() as any;
    this.http.get<any>(`${environment.apiUrl}/orders/my-orders`, { headers }).subscribe({
      next: res => {
        if (res.success) this.orders = res.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getShortId(id: string): string {
    return id ? id.substring(0, 8).toUpperCase() : '';
  }
}
