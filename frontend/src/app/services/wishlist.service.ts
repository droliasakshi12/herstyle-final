import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private key = 'herstyle_wishlist';
  private itemsSubject = new BehaviorSubject<Product[]>(this.load());
  items$ = this.itemsSubject.asObservable();

  private load(): Product[] {
    try { return JSON.parse(localStorage.getItem(this.key) || '[]'); } catch { return []; }
  }

  private save(items: Product[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
    this.itemsSubject.next(items);
  }

  getItems(): Product[] { return this.itemsSubject.value; }

  isWishlisted(productId: string): boolean {
    return this.itemsSubject.value.some(p => (p.id || p._id) === productId);
  }

  toggle(product: Product): boolean {
    const pid = product.id || product._id;
    const current = this.itemsSubject.value;
    const idx = current.findIndex(p => (p.id || p._id) === pid);
    if (idx >= 0) {
      this.save(current.filter(p => (p.id || p._id) !== pid));
      return false;
    } else {
      this.save([...current, product]);
      return true;
    }
  }

  remove(productId: string): void {
    this.save(this.itemsSubject.value.filter(p => (p.id || p._id) !== productId));
  }

  get count(): number { return this.itemsSubject.value.length; }
}
