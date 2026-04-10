import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError, map } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Product, Category, ApiResponse } from '../models/product.model';

const LOCAL_PRODUCTS_KEY = 'local_products';
const LOCAL_CATEGORIES_KEY = 'local_categories';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) {}

  // ── LOCAL STORAGE HELPERS ───────────────────────────────────────
  private getLocalProducts(): Product[] {
    try { return JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || '[]'); } catch { return []; }
  }
  private setLocalProducts(products: Product[]) {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  }
  private getLocalCategories(): Category[] {
    try { return JSON.parse(localStorage.getItem(LOCAL_CATEGORIES_KEY) || '[]'); } catch { return []; }
  }
  private setLocalCategories(cats: Category[]) {
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(cats));
  }

  // ── PRODUCTS ────────────────────────────────────────────────────
  getProducts(filters?: Record<string,string>): Observable<ApiResponse<Product[]>> {
    let params = new HttpParams();
    if (filters) Object.keys(filters).forEach(k => { if (filters[k]) params = params.set(k, filters[k]); });
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products`, { params }).pipe(
      tap(res => {
        // Always keep localStorage in sync with the database
        if (res.success) this.setLocalProducts(res.data);
      }),
      catchError(err => {
        // If backend is offline, fall back to locally cached data
        const local = this.getLocalProducts();
        if (local.length > 0) {
          return of({ success: true, data: local, count: local.length });
        }
        return throwError(() => err);
      })
    );
  }

  getProduct(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(err => {
        // Fallback: find the product in local cache
        const local = this.getLocalProducts();
        const product = local.find(p => (p._id || p.id) === id);
        if (product) return of({ success: true, data: product });
        return throwError(() => err);
      })
    );
  }

  createProduct(product: Product): Observable<ApiResponse<Product>> {
    const headers = this.authService.getAuthHeader() as any;
    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/products`, product, { headers }).pipe(
      tap(res => {
        // On success, also save to local storage
        if (res.success) {
          const local = this.getLocalProducts();
          local.push(res.data);
          this.setLocalProducts(local);
        }
      }),
      catchError(err => {
        // If backend fails, save locally with a temp ID
        const local = this.getLocalProducts();
        const newProduct: any = { ...product, id: 'local_' + Date.now(), _id: 'local_' + Date.now(), _isLocal: true };
        local.push(newProduct);
        this.setLocalProducts(local);
        return of({ success: true, data: newProduct });
      })
    );
  }

  updateProduct(id: string, product: Product): Observable<ApiResponse<Product>> {
    const headers = this.authService.getAuthHeader() as any;
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`, product, { headers }).pipe(
      tap(res => {
        // Sync update to local storage
        if (res.success) {
          const local = this.getLocalProducts();
          const idx = local.findIndex(p => (p._id || p.id) === id);
          if (idx !== -1) { local[idx] = res.data; this.setLocalProducts(local); }
        }
      }),
      catchError(err => {
        // Update locally if backend is down
        const local = this.getLocalProducts();
        const idx = local.findIndex(p => (p._id || p.id) === id);
        if (idx !== -1) {
          local[idx] = { ...local[idx], ...product };
          this.setLocalProducts(local);
          return of({ success: true, data: local[idx] });
        }
        return throwError(() => err);
      })
    );
  }

  deleteProduct(id: string): Observable<ApiResponse<null>> {
    const headers = this.authService.getAuthHeader() as any;
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/products/${id}`, { headers }).pipe(
      tap(res => {
        // Sync delete to local storage
        if (res.success) {
          const local = this.getLocalProducts().filter(p => (p._id || p.id) !== id);
          this.setLocalProducts(local);
        }
      }),
      catchError(err => {
        // Delete locally if backend is down
        const local = this.getLocalProducts().filter(p => (p._id || p.id) !== id);
        this.setLocalProducts(local);
        return of({ success: true, data: null });
      })
    );
  }

  // ── CATEGORIES ──────────────────────────────────────────────────
  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`).pipe(
      tap(res => {
        if (res.success) this.setLocalCategories(res.data);
      }),
      catchError(err => {
        const local = this.getLocalCategories();
        if (local.length > 0) return of({ success: true, data: local, count: local.length });
        return throwError(() => err);
      })
    );
  }

  createCategory(category: Category): Observable<ApiResponse<Category>> {
    const headers = this.authService.getAuthHeader() as any;
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/categories`, category, { headers }).pipe(
      tap(res => {
        if (res.success) {
          const local = this.getLocalCategories();
          local.push(res.data);
          this.setLocalCategories(local);
        }
      }),
      catchError(err => {
        const local = this.getLocalCategories();
        const newCat: any = { ...category, id: 'local_' + Date.now(), _id: 'local_' + Date.now(), _isLocal: true };
        local.push(newCat);
        this.setLocalCategories(local);
        return of({ success: true, data: newCat });
      })
    );
  }

  updateCategory(id: string, category: Category): Observable<ApiResponse<Category>> {
    const headers = this.authService.getAuthHeader() as any;
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/categories/${id}`, category, { headers }).pipe(
      tap(res => {
        if (res.success) {
          const local = this.getLocalCategories();
          const idx = local.findIndex(c => (c._id || c.id) === id);
          if (idx !== -1) { local[idx] = res.data; this.setLocalCategories(local); }
        }
      }),
      catchError(err => {
        const local = this.getLocalCategories();
        const idx = local.findIndex(c => (c._id || c.id) === id);
        if (idx !== -1) {
          local[idx] = { ...local[idx], ...category };
          this.setLocalCategories(local);
          return of({ success: true, data: local[idx] });
        }
        return throwError(() => err);
      })
    );
  }

  deleteCategory(id: string): Observable<ApiResponse<null>> {
    const headers = this.authService.getAuthHeader() as any;
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/categories/${id}`, { headers }).pipe(
      tap(res => {
        if (res.success) {
          const local = this.getLocalCategories().filter(c => (c._id || c.id) !== id);
          this.setLocalCategories(local);
        }
      }),
      catchError(err => {
        const local = this.getLocalCategories().filter(c => (c._id || c.id) !== id);
        this.setLocalCategories(local);
        return of({ success: true, data: null });
      })
    );
  }
}
