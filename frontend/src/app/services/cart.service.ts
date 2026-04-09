import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CartItem, ApiResponse } from '../models/product.model';

export interface CartResponse {
  success: boolean;
  data: CartItem[];
  total: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = environment.apiUrl;
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();
  private sessionId: string;

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('herstyle_session');
    this.sessionId = stored ?? this.generateSession();
    localStorage.setItem('herstyle_session', this.sessionId);
    this.refreshCount();
  }

  private generateSession(): string {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now();
  }

  getSessionId(): string { return this.sessionId; }

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.apiUrl}/cart/${this.sessionId}`);
  }

  addToCart(item: Partial<CartItem>): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/cart`, {
      ...item,
      session_id: this.sessionId
    }).pipe(tap(() => this.refreshCount()));
  }

  updateQuantity(cartItemId: string, quantity: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/cart/${cartItemId}`, { quantity });
  }

  removeFromCart(cartItemId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/cart/${cartItemId}`)
      .pipe(tap(() => this.refreshCount()));
  }

  clearCart(): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/cart/clear/${this.sessionId}`)
      .pipe(tap(() => this.cartCountSubject.next(0)));
  }

  private refreshCount(): void {
    this.getCart().subscribe({
      next: (res) => {
        if (res.success) {
          const count = res.data.reduce((sum, item) => sum + item.quantity, 0);
          this.cartCountSubject.next(count);
        }
      },
      error: () => {}
    });
  }
}
