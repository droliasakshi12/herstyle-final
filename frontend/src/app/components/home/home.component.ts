import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, Category } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- HERO: Elegant full-width, no external images -->
    <section class="hero">
      <div class="hero-pattern"></div>
      <div class="hero-inner">
        <div class="hero-brand">
          <span class="hero-ornament">✦</span>
          <span class="hero-brand-name">HerStyle</span>
          <span class="hero-ornament">✦</span>
        </div>
        <span class="hero-tag">New Collection 2024</span>
        <h1 class="hero-title">Fashion made<br><em>for her.</em></h1>
        <p class="hero-sub">Curated styles for the modern Indian woman —<br>ethnic, western, casual and beyond.</p>
        <div class="hero-actions">
          <a routerLink="/products" class="btn-primary">Shop Now</a>
          <a routerLink="/products" class="btn-outline">New Arrivals →</a>
        </div>
        <div class="hero-stats">
          <div class="hstat"><span class="hstat-num">500+</span><span class="hstat-label">Styles</span></div>
          <div class="hstat-div"></div>
          <div class="hstat"><span class="hstat-num">50K+</span><span class="hstat-label">Happy Customers</span></div>
          <div class="hstat-div"></div>
          <div class="hstat"><span class="hstat-num">Free</span><span class="hstat-label">Returns</span></div>
        </div>
      </div>
    </section>

    <!-- MARQUEE STRIP -->
    <div class="marquee-strip">
      <div class="marquee-track">
        <span>New Arrivals</span><span class="dot">✦</span><span>Free Shipping Above ₹999</span><span class="dot">✦</span>
        <span>Exclusive Summer Collection</span><span class="dot">✦</span><span>Up to 50% Off</span><span class="dot">✦</span>
        <span>Ethnic Wear Drop</span><span class="dot">✦</span><span>Trending: Anarkali Sets</span><span class="dot">✦</span>
        <span>New Arrivals</span><span class="dot">✦</span><span>Free Shipping Above ₹999</span><span class="dot">✦</span>
        <span>Exclusive Summer Collection</span><span class="dot">✦</span><span>Up to 50% Off</span><span class="dot">✦</span>
        <span>Ethnic Wear Drop</span><span class="dot">✦</span><span>Trending: Anarkali Sets</span><span class="dot">✦</span>
      </div>
    </div>

    <!-- CATEGORIES — 6 cards -->
    <section class="categories-section">
      <div class="sec-header">
        <div class="sec-tag">Browse</div>
        <h2>Shop by Category</h2>
      </div>
      <div class="categories-grid">
        @for (cat of categories; track cat.id) {
          <div class="cat-card" [routerLink]="['/products']" [queryParams]="{category: cat.id}">
            <div class="cat-img-wrap">
              <img [src]="cat.image_url || womenCatImages[$index % womenCatImages.length]" [alt]="cat.name" />
              <div class="cat-gradient"></div>
            </div>
            <div class="cat-label"><h3>{{ cat.name }}</h3><span class="cat-arrow">→</span></div>
          </div>
        }
        @if (categories.length === 0) {
          @for (dc of defaultCats; track dc.name) {
            <div class="cat-card" [routerLink]="['/products']">
              <div class="cat-img-wrap"><img [src]="dc.img" [alt]="dc.name" /><div class="cat-gradient"></div></div>
              <div class="cat-label"><h3>{{ dc.name }}</h3><span class="cat-arrow">→</span></div>
            </div>
          }
        }
      </div>
    </section>

    <!-- EDITORIAL SPLIT -->
    <section class="editorial-section">
      <div class="editorial-grid">
        <div class="ed-img ed-tall">
          <img src="https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80" alt="Ethnic fashion" />
          <div class="ed-overlay"><span class="ed-tag">✦ Ethnic Wear</span></div>
        </div>
        <div class="ed-col-right">
          <div class="ed-img ed-short">
            <img src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=80" alt="Western wear" />
            <div class="ed-overlay"><span class="ed-tag">✦ Western Wear</span></div>
          </div>
          <div class="ed-img ed-short">
            <img src="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80" alt="Fusion styles" />
            <div class="ed-overlay"><span class="ed-tag">✦ Fusion Styles</span></div>
          </div>
        </div>
        <div class="editorial-text">
          <span class="ed-eyebrow">Our Story</span>
          <h2>Fashion Made<br><em>For Her,</em><br>By Her.</h2>
          <p>Every stitch, every silhouette — crafted with the modern Indian woman in mind. Bold, beautiful, unapologetically her.</p>
          <a routerLink="/products" class="btn-editorial">Explore Looks →</a>
        </div>
      </div>
    </section>

    <!-- FEATURED PRODUCTS — 12 cards, 4-col -->
    <section class="products-section">
      <div class="sec-header">
        <div class="sec-tag">Handpicked</div>
        <h2>Featured Collection</h2>
        <a routerLink="/products" class="see-all-link">See All →</a>
      </div>
      @if (loading) {
        <div class="loading-wrap"><div class="spinner"></div><p>Curating the best for you…</p></div>
      }
      @if (!loading) {
        <div class="products-grid">
          @for (product of getFeaturedDisplay(); track product.id || product.name) {
            <div class="product-card">
              <div class="product-img-wrap" (click)="goToProduct(product)" style="cursor:pointer">
                <img [src]="product.image_url || ''" [alt]="product.name" />
                <div class="product-badges">
                  @if (product.is_new) { <span class="badge new">New</span> }
                  @if (product.original_price && product.original_price > product.price) { <span class="badge sale">Sale</span> }
                </div>
              </div>
              <div class="product-meta">
                <span class="p-cat">{{ product.category_name || 'Collection' }}</span>
                <h3 class="p-name" (click)="goToProduct(product)" style="cursor:pointer">{{ product.name }}</h3>
                <div class="p-price-row">
                  <span class="p-price">₹{{ product.price | number:'1.0-0' }}</span>
                  @if (product.original_price) { <span class="p-orig">₹{{ product.original_price | number:'1.0-0' }}</span> }
                </div>
                <div class="p-actions">
                  <button class="btn-view" (click)="goToProduct(product)">View</button>
                  <button class="btn-cart" (click)="quickAddToCart(product, $event)">+ Cart</button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </section>

    <!-- LOOKBOOK STRIP — 5 large women photos -->
    <section class="lookbook-section">
      <div class="lookbook-header">
        <div class="sec-tag">Lookbook</div>
        <h2>This Season's Looks</h2>
        <a routerLink="/products" class="see-all-link">Shop All →</a>
      </div>
      <div class="lookbook-strip">
        @for (look of lookbookImages; track look.label) {
          <div class="lookbook-item" [routerLink]="['/products']">
            <img [src]="look.img" [alt]="look.label" />
            <div class="lookbook-overlay">
              <span>{{ look.label }}</span>
              <span class="look-shop">Shop Now →</span>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- PROMO BANNER -->
    <section class="promo-section">
      <div class="promo-bg">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80" alt="Fashion women" />
        <div class="promo-overlay"></div>
      </div>
      <div class="promo-content">
        <span class="promo-eyebrow">Limited Time</span>
        <h2>Summer Sale</h2>
        <p class="promo-offer">Up to <strong>50% Off</strong> on selected styles</p>
        <a routerLink="/products" class="btn-promo">Shop the Sale →</a>
      </div>
    </section>

    <!-- NEW ARRIVALS MINI GRID — 8 cards -->
    <section class="arrivals-section">
      <div class="sec-header">
        <div class="sec-tag">Just In</div>
        <h2>New Arrivals</h2>
        <a routerLink="/products" class="see-all-link">See All →</a>
      </div>
      <div class="arrivals-grid">
        @for (item of newArrivalItems; track item.name) {
          <div class="arrival-card" [routerLink]="['/products']">
            <div class="arrival-img"><img [src]="item.img" [alt]="item.name" /><span class="arrival-badge">New</span></div>
            <div class="arrival-info">
              <span class="arrival-cat">{{ item.cat }}</span>
              <h4>{{ item.name }}</h4>
              <span class="arrival-price">{{ item.price }}</span>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- STYLE INSPO — 4 cards -->
    <section class="inspo-section">
      <div class="sec-header center">
        <div class="sec-tag">Inspiration</div>
        <h2>Style for Every Occasion</h2>
      </div>
      <div class="inspo-grid">
        @for (inspo of inspoItems; track inspo.label) {
          <div class="inspo-card" [routerLink]="['/products']">
            <img [src]="inspo.img" [alt]="inspo.label" />
            <div class="inspo-label">{{ inspo.label }}</div>
          </div>
        }
      </div>
    </section>

    <!-- BRAND PROMISES -->
    <section class="promises-section">
      @for (p of promises; track p.icon) {
        <div class="promise-item">
          <span class="promise-icon">{{ p.icon }}</span>
          <strong>{{ p.title }}</strong>
          <span>{{ p.desc }}</span>
        </div>
      }
    </section>

    @if (toastMessage) {
      <div class="toast" [class.toast-error]="toastError">{{ toastMessage }}</div>
    }
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
    :host { --brown:#8B6847; --brown-dark:#6B4F33; --brown-light:#C4A882; --ink:#4A3728; --beige:#F5EFE6; --muted:#9C8877; display:block; font-family:'Jost',sans-serif; background:var(--beige); }

    /* HERO */
    .hero { background:linear-gradient(160deg, #F5EFE6 0%, #EDE3D4 50%, #E8DDD0 100%); border-bottom:1px solid #ddd0c4; position:relative; overflow:hidden; text-align:center; }
    .hero-pattern { position:absolute; inset:0; background-image: radial-gradient(circle at 20% 80%, rgba(139,104,71,0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139,104,71,0.05) 0%, transparent 50%); pointer-events:none; }
    .hero-inner { max-width:760px; margin:0 auto; padding:90px 40px 80px; position:relative; z-index:1; display:flex; flex-direction:column; align-items:center; }
    .hero-brand { display:flex; align-items:center; gap:16px; margin-bottom:24px; }
    .hero-brand-name { font-family:'Cormorant Garamond',Georgia,serif; font-size:2.2rem; font-weight:600; color:var(--brown); letter-spacing:6px; text-transform:uppercase; }
    .hero-ornament { font-size:0.85rem; color:var(--brown-light); opacity:0.7; }
    .hero-tag { display:inline-block; font-size:0.7rem; letter-spacing:3px; text-transform:uppercase; color:var(--brown); font-weight:600; background:rgba(139,104,71,0.12); padding:6px 18px; border-radius:20px; margin-bottom:28px; border:1px solid rgba(139,104,71,0.2); }
    .hero-title { font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(3rem,5.5vw,5rem); color:#4A3728; line-height:1.1; margin:0 0 22px; }
    .hero-title em { color:var(--brown); font-style:italic; }
    .hero-sub { font-size:1.05rem; color:#9C8877; line-height:1.8; margin-bottom:40px; font-weight:400; }
    .hero-actions { display:flex; gap:14px; flex-wrap:wrap; margin-bottom:56px; justify-content:center; }
    .btn-primary { background:var(--brown); color:white; padding:14px 36px; border-radius:6px; text-decoration:none; font-weight:600; font-size:0.92rem; transition:all 0.25s; letter-spacing:0.5px; }
    .btn-primary:hover { background:var(--brown-dark); transform:translateY(-2px); box-shadow:0 8px 24px rgba(139,104,71,0.35); }
    .btn-outline { border:1.5px solid var(--brown); color:var(--brown); padding:13px 30px; border-radius:6px; text-decoration:none; font-weight:600; font-size:0.92rem; transition:all 0.25s; }
    .btn-outline:hover { background:var(--brown); color:white; }
    .hero-stats { display:flex; align-items:center; gap:36px; }
    .hstat { display:flex; flex-direction:column; align-items:center; }
    .hstat-num { font-size:1.6rem; font-weight:700; color:#4A3728; line-height:1; }
    .hstat-label { font-size:0.7rem; color:#9C8877; margin-top:5px; letter-spacing:1.5px; text-transform:uppercase; }
    .hstat-div { width:1px; height:36px; background:rgba(74,55,40,0.15); }

    /* MARQUEE */
    .marquee-strip { background:var(--brown); color:white; padding:12px 0; overflow:hidden; white-space:nowrap; }
    .marquee-track { display:inline-flex; gap:30px; animation:marquee 30s linear infinite; font-size:0.8rem; font-weight:500; letter-spacing:1.5px; text-transform:uppercase; }
    .marquee-track span { white-space:nowrap; }
    .dot { color:rgba(255,255,255,0.5); }
    @keyframes marquee { from{transform:translateX(0);}to{transform:translateX(-50%);} }

    /* SECTION HEADER */
    .sec-header { display:flex; align-items:baseline; gap:20px; margin-bottom:40px; padding:0 40px; flex-wrap:wrap; }
    .sec-header h2 { font-family:'Cormorant Garamond',Georgia,serif; font-size:2rem; color:#4A3728; margin:0; flex:1; }
    .sec-header.center { flex-direction:column; align-items:center; text-align:center; padding:0 20px; }
    .sec-tag { font-size:0.7rem; letter-spacing:3px; text-transform:uppercase; color:var(--brown); font-weight:600; background:var(--beige-border); padding:4px 12px; border-radius:20px; white-space:nowrap; }
    .see-all-link { color:var(--brown); text-decoration:none; font-weight:500; font-size:0.88rem; white-space:nowrap; }

    /* CATEGORIES */
    .categories-section { padding:70px 40px; max-width:1320px; margin:0 auto; }
    .categories-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:16px; }
    .cat-card { cursor:pointer; border-radius:12px; overflow:hidden; position:relative; box-shadow:0 4px 20px rgba(0,0,0,0.08); transition:transform 0.35s,box-shadow 0.35s; }
    .cat-card:hover { transform:translateY(-6px); box-shadow:0 14px 40px rgba(0,0,0,0.14); }
    .cat-img-wrap { position:relative; overflow:hidden; height:200px; }
    .cat-img-wrap img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s ease; }
    .cat-card:hover .cat-img-wrap img { transform:scale(1.08); }
    .cat-gradient { position:absolute; inset:0; background:linear-gradient(to top,rgba(74,55,40,0.72) 0%,transparent 60%); }
    .cat-label { position:absolute; bottom:0; left:0; right:0; padding:14px 16px; display:flex; justify-content:space-between; align-items:center; color:white; }
    .cat-label h3 { margin:0; font-size:0.9rem; font-weight:600; }
    .cat-arrow { font-size:1rem; opacity:0.8; transition:transform 0.3s; }
    .cat-card:hover .cat-arrow { transform:translateX(4px); }

    /* EDITORIAL */
    .editorial-section { padding:0 40px 80px; max-width:1320px; margin:0 auto; }
    .editorial-grid { display:grid; grid-template-columns:1fr 1fr 360px; gap:18px; align-items:center; }
    .ed-img { border-radius:12px; overflow:hidden; position:relative; }
    .ed-img img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.5s; }
    .ed-img:hover img { transform:scale(1.04); }
    .ed-tall { height:520px; }
    .ed-col-right { display:flex; flex-direction:column; gap:18px; }
    .ed-short { height:248px; }
    .ed-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(74,55,40,0.55) 0%,transparent 50%); display:flex; align-items:flex-end; padding:18px; }
    .ed-tag { color:white; font-size:0.72rem; letter-spacing:2px; text-transform:uppercase; font-weight:500; }
    .editorial-text { padding:36px; }
    .ed-eyebrow { font-size:0.7rem; letter-spacing:3px; text-transform:uppercase; color:var(--brown); font-weight:600; }
    .editorial-text h2 { font-family:'Cormorant Garamond',Georgia,serif; font-size:2.4rem; color:#4A3728; margin:14px 0; line-height:1.2; }
    .editorial-text h2 em { color:var(--brown); font-style:italic; }
    .editorial-text p { color:#9C8877; line-height:1.75; font-size:0.92rem; margin-bottom:28px; }
    .btn-editorial { display:inline-block; border-bottom:2px solid var(--brown); color:var(--brown); text-decoration:none; font-weight:600; font-size:0.9rem; padding-bottom:4px; transition:all 0.3s; }
    .btn-editorial:hover { color:var(--brown-dark); border-color:var(--brown-dark); }

    /* FEATURED PRODUCTS */
    .products-section { padding:0 40px 80px; max-width:1320px; margin:0 auto; }
    .products-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
    .product-card { background:white; border-radius:12px; overflow:hidden; box-shadow:0 2px 16px rgba(0,0,0,0.06); transition:transform 0.3s,box-shadow 0.3s; }
    .product-card:hover { transform:translateY(-6px); box-shadow:0 12px 40px rgba(0,0,0,0.12); }
    .product-img-wrap { position:relative; overflow:hidden; }
    .product-img-wrap img { width:100%; height:270px; object-fit:cover; display:block; transition:transform 0.5s; }
    .product-card:hover .product-img-wrap img { transform:scale(1.06); }
    .product-badges { position:absolute; top:14px; left:14px; display:flex; gap:6px; }
    .badge { padding:4px 10px; border-radius:4px; font-size:0.7rem; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; }
    .badge.new { background:var(--brown); color:white; }
    .badge.sale { background:#ff6b35; color:white; }
    .product-hover { position:absolute; inset:0; background:rgba(74,55,40,0.55); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; opacity:0; transition:opacity 0.3s; }
    .product-card:hover .product-hover { opacity:1; }
    .phover-btn { background:white; color:#4A3728; padding:10px 22px; border-radius:4px; border:none; cursor:pointer; font-weight:600; font-size:0.83rem; text-decoration:none; transition:all 0.2s; }
    .phover-btn:hover { background:var(--brown); color:white; }
    .product-meta { padding:16px; }
    .p-cat { font-size:0.7rem; color:var(--brown); text-transform:uppercase; letter-spacing:1.5px; font-weight:600; }
    .p-name { font-size:0.92rem; color:#4A3728; font-weight:600; margin:5px 0 8px; line-height:1.4; }
    .p-price-row { display:flex; align-items:center; gap:10px; }
    .p-actions { display:flex; gap:8px; margin-top:10px; }
    .btn-view { flex:1; padding:8px 0; border:1.5px solid var(--brown); color:var(--brown); background:none; border-radius:7px; cursor:pointer; font-size:0.82rem; font-weight:600; transition:all 0.2s; font-family:'Jost',sans-serif; }
    .btn-view:hover { background:var(--brown); color:white; }
    .btn-cart { flex:1; padding:8px 0; background:var(--brown); color:white; border:none; border-radius:7px; cursor:pointer; font-size:0.82rem; font-weight:600; transition:background 0.2s; font-family:'Jost',sans-serif; }
    .btn-cart:hover { background:#6B4F33; }
    .p-price { font-size:1.05rem; font-weight:700; color:var(--brown); }
    .p-orig { font-size:0.82rem; color:#bbb; text-decoration:line-through; }

    /* LOOKBOOK STRIP */
    .lookbook-section { padding:0 40px 80px; max-width:1320px; margin:0 auto; }
    .lookbook-header { display:flex; align-items:baseline; gap:20px; margin-bottom:30px; flex-wrap:wrap; }
    .lookbook-header h2 { font-family:'Cormorant Garamond',Georgia,serif; font-size:2rem; color:#4A3728; margin:0; flex:1; }
    .lookbook-strip { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; }
    .lookbook-item { position:relative; cursor:pointer; border-radius:12px; overflow:hidden; height:420px; }
    .lookbook-item img { width:100%; height:100%; object-fit:cover; transition:transform 0.6s ease; }
    .lookbook-item:hover img { transform:scale(1.07); }
    .lookbook-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(74,55,40,0.7) 0%,transparent 50%); display:flex; flex-direction:column; justify-content:flex-end; padding:20px 16px; color:white; }
    .lookbook-overlay span:first-child { font-family:'Cormorant Garamond',Georgia,serif; font-size:1rem; font-style:italic; margin-bottom:6px; }
    .look-shop { font-size:0.72rem; letter-spacing:1.5px; text-transform:uppercase; color:#C4A882; font-weight:600; opacity:0; transform:translateY(6px); transition:all 0.3s; }
    .lookbook-item:hover .look-shop { opacity:1; transform:translateY(0); }

    /* PROMO */
    .promo-section { position:relative; height:420px; display:flex; align-items:center; justify-content:center; overflow:hidden; margin:0 0 80px; }
    .promo-bg { position:absolute; inset:0; }
    .promo-bg img { width:100%; height:100%; object-fit:cover; object-position:center 25%; }
    .promo-overlay { position:absolute; inset:0; background:linear-gradient(135deg,rgba(74,55,40,0.75),rgba(139,104,71,0.55)); }
    .promo-content { position:relative; z-index:2; text-align:center; color:white; }
    .promo-eyebrow { font-size:0.7rem; letter-spacing:3px; text-transform:uppercase; color:#C4A882; font-weight:600; display:block; margin-bottom:14px; }
    .promo-content h2 { font-family:'Cormorant Garamond',Georgia,serif; font-size:3.5rem; margin:0 0 10px; line-height:1; }
    .promo-offer { font-size:1.05rem; margin-bottom:28px; opacity:0.9; }
    .btn-promo { display:inline-block; border:2px solid white; color:white; padding:12px 34px; border-radius:4px; text-decoration:none; font-weight:600; font-size:0.9rem; transition:all 0.3s; }
    .btn-promo:hover { background:white; color:var(--brown); }

    /* NEW ARRIVALS */
    .arrivals-section { padding:0 40px 80px; max-width:1320px; margin:0 auto; }
    .arrivals-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
    .arrival-card { cursor:pointer; background:white; border-radius:12px; overflow:hidden; box-shadow:0 2px 14px rgba(0,0,0,0.06); transition:transform 0.3s,box-shadow 0.3s; }
    .arrival-card:hover { transform:translateY(-5px); box-shadow:0 10px 30px rgba(0,0,0,0.11); }
    .arrival-img { position:relative; overflow:hidden; }
    .arrival-img img { width:100%; height:240px; object-fit:cover; display:block; transition:transform 0.5s; }
    .arrival-card:hover .arrival-img img { transform:scale(1.06); }
    .arrival-badge { position:absolute; top:12px; right:12px; background:var(--brown); color:white; padding:3px 10px; border-radius:4px; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
    .arrival-info { padding:14px 16px; }
    .arrival-cat { font-size:0.68rem; color:var(--brown); text-transform:uppercase; letter-spacing:1.5px; font-weight:600; }
    .arrival-info h4 { font-size:0.9rem; color:#4A3728; font-weight:600; margin:5px 0 8px; line-height:1.35; }
    .arrival-price { font-size:1rem; font-weight:700; color:var(--brown); }

    /* INSPO */
    .inspo-section { padding:0 40px 80px; max-width:1320px; margin:0 auto; }
    .inspo-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
    .inspo-card { position:relative; cursor:pointer; border-radius:12px; overflow:hidden; height:340px; }
    .inspo-card img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s; }
    .inspo-card:hover img { transform:scale(1.07); }
    .inspo-label { position:absolute; inset:0; display:flex; align-items:flex-end; padding:24px; background:linear-gradient(to top,rgba(74,55,40,0.65) 0%,transparent 55%); color:white; font-family:'Cormorant Garamond',Georgia,serif; font-size:1.2rem; font-style:italic; transition:padding 0.3s; }
    .inspo-card:hover .inspo-label { padding-bottom:30px; }

    /* PROMISES */
    .promises-section { background:white; display:grid; grid-template-columns:repeat(4,1fr); gap:0; border-top:1px solid #f0e8ea; border-bottom:1px solid #f0e8ea; margin-bottom:0; }
    .promise-item { display:flex; flex-direction:column; align-items:center; text-align:center; padding:36px 24px; gap:8px; border-right:1px solid #f0e8ea; }
    .promise-item:last-child { border-right:none; }
    .promise-icon { font-size:2rem; }
    .promise-item strong { font-size:0.9rem; color:#4A3728; font-weight:700; }
    .promise-item span { font-size:0.82rem; color:#9C8877; line-height:1.4; }

    /* MISC */
    .loading-wrap { text-align:center; padding:70px; color:#9C8877; }
    .spinner { width:38px; height:38px; border:3px solid #f3d4d9; border-top:3px solid var(--brown); border-radius:50%; animation:spin 0.9s linear infinite; margin:0 auto 16px; }
    @keyframes spin { to{transform:rotate(360deg);} }
    .toast { position:fixed; bottom:30px; right:30px; background:#4A3728; color:white; padding:14px 24px; border-radius:8px; font-size:0.88rem; z-index:9999; animation:fadeUp 0.3s ease; }
    .toast-error { background:#c0392b; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;} }

    @media(max-width:1200px) {
      .categories-grid { grid-template-columns:repeat(3,1fr); }
      .lookbook-strip { grid-template-columns:repeat(3,1fr); }
    }
    @media(max-width:1024px) {
      .editorial-grid { grid-template-columns:1fr 1fr; }
      .editorial-text { grid-column:span 2; padding:20px 0; }
      .products-grid { grid-template-columns:repeat(3,1fr); }
      .arrivals-grid { grid-template-columns:repeat(3,1fr); }
      .promises-section { grid-template-columns:repeat(2,1fr); }
    }
    @media(max-width:768px) {
      .hero-inner { padding:60px 20px 48px; }
      .hero-brand-name { font-size:1.6rem; letter-spacing:4px; }
      .categories-section,.products-section,.inspo-section,.editorial-section,.lookbook-section,.arrivals-section { padding-left:20px; padding-right:20px; }
      .sec-header,.lookbook-header { padding:0 20px; }
      .categories-grid { grid-template-columns:repeat(2,1fr); }
      .products-grid,.arrivals-grid { grid-template-columns:repeat(2,1fr); }
      .inspo-grid { grid-template-columns:repeat(2,1fr); }
      .editorial-grid { grid-template-columns:1fr; }
      .ed-col-right { flex-direction:row; }
      .editorial-text { padding:10px 0 20px; }
      .lookbook-strip { grid-template-columns:repeat(2,1fr); }
      .promises-section { grid-template-columns:repeat(2,1fr); }
    }
    @media(max-width:480px) {
      .products-grid,.arrivals-grid { grid-template-columns:1fr 1fr; }
      .inspo-grid { grid-template-columns:1fr 1fr; }
      .lookbook-strip { grid-template-columns:1fr 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;
  toastMessage = '';
  toastError = false;

  womenCatImages = [
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
    'https://images.unsplash.com/photo-1566174182-2d8e3a24c8c2?w=400&q=80',
    'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=400&q=80',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80',
  ];

  defaultCats = [
    { name: 'Dresses',      img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80' },
    { name: 'Tops',         img: 'https://images.unsplash.com/photo-1566174182-2d8e3a24c8c2?w=400&q=80' },
    { name: 'Ethnic Wear',  img: 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=400&q=80' },
    { name: 'Casuals',      img: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80' },
    { name: 'Party Wear',   img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80' },
    { name: 'Accessories',  img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80' },
  ];

  mockProducts = [
    { name:'Floral Anarkali Set', category_name:'Ethnic Wear', price:1899, original_price:2799, is_new:true, image_url:'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=500&q=80' },
    { name:'Pastel Wrap Dress', category_name:'Dresses', price:1499, original_price:2100, is_new:false, image_url:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80' },
    { name:'Layered Gold Necklace Set', category_name:'Accessories', price:699, original_price:999, is_new:true, image_url:'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80' },
    { name:'Wide-Leg Palazzo', category_name:'Casuals', price:1199, original_price:1699, is_new:false, image_url:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80' },
    { name:'Banarasi Silk Kurta Set', category_name:'Ethnic Wear', price:3499, original_price:4999, is_new:true, image_url:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80' },
    { name:'Kundan Jhumka Earrings', category_name:'Accessories', price:549, original_price:799, is_new:false, image_url:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80' },
    { name:'Off-Shoulder Blouse', category_name:'Tops', price:949, original_price:1299, is_new:true, image_url:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80' },
    { name:'Printed Coord Set', category_name:'Casuals', price:1699, original_price:null, is_new:false, image_url:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80' },
    { name:'Chanderi Sharara Set', category_name:'Ethnic Wear', price:2799, original_price:3799, is_new:true, image_url:'https://images.unsplash.com/photo-1583391099995-99218ee73b87?w=500&q=80' },
    { name:'Kundan Maang Tikka Set', category_name:'Accessories', price:899, original_price:1299, is_new:false, image_url:'https://images.unsplash.com/photo-1601612628452-9e99ced43524?w=500&q=80' },
    { name:'Tie-Dye Tee', category_name:'Tops', price:599, original_price:null, is_new:true, image_url:'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=500&q=80' },
    { name:'Kalamkari Cotton Kurti', category_name:'Ethnic Wear', price:1599, original_price:null, is_new:true, image_url:'https://images.unsplash.com/photo-1559563458-527698bf5295?w=500&q=80' },
  ];

  lookbookImages = [
    { img:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80', label:'Bold & Bright' },
    { img:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80', label:'Minimalist Chic' },
    { img:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80', label:'Street Style' },
    { img:'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=500&q=80', label:'Ethnic Glam' },
    { img:'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=500&q=80', label:'Evening Luxe' },
  ];

  newArrivalItems = [
    { name:'Layered Gold Necklace', cat:'Accessories', price:'₹699', img:'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80' },
    { name:'Chanderi Sharara Set', cat:'Ethnic Wear', price:'₹2,799', img:'https://images.unsplash.com/photo-1583391099995-99218ee73b87?w=500&q=80' },
    { name:'Kundan Jhumka Earrings', cat:'Accessories', price:'₹549', img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80' },
    { name:'Kalamkari Cotton Kurti', cat:'Ethnic Wear', price:'₹1,599', img:'https://images.unsplash.com/photo-1559563458-527698bf5295?w=500&q=80' },
    { name:'Pearl Choker Necklace', cat:'Accessories', price:'₹499', img:'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&q=80' },
    { name:'Banarasi Silk Kurta', cat:'Ethnic Wear', price:'₹3,499', img:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80' },
    { name:'Beaded Tassel Earrings', cat:'Accessories', price:'₹299', img:'https://images.unsplash.com/photo-1588444650733-d0d3d43f0e6e?w=500&q=80' },
    { name:'Velvet Lehenga Set', cat:'Party Wear', price:'₹4,999', img:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80' },
  ];

  inspoItems = [
    { label:'Office Ready',   img:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80' },
    { label:'Party Glam',     img:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80' },
    { label:'Everyday Chic',  img:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80' },
    { label:'Festive Looks',  img:'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=500&q=80' },
  ];

  promises = [
    { icon:'🚚', title:'Free Shipping', desc:'On orders above ₹999 across India' },
    { icon:'↩️', title:'Easy Returns', desc:'30-day hassle-free return policy' },
    { icon:'✦', title:'Authentic Quality', desc:'Handpicked, quality-checked pieces' },
    { icon:'🔒', title:'Secure Payments', desc:'100% safe & encrypted checkout' },
  ];

  constructor(private productService: ProductService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe({ next: (res) => { if (res.success) this.categories = res.data; } });
    this.productService.getProducts({ featured: 'true', limit: '50' }).subscribe({
      next: (res) => { if (res.success) this.featuredProducts = res.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  getFeaturedDisplay(): any[] {
    return this.featuredProducts.slice(0, 12);
  }

  goToProduct(product: any): void {
    const id = product.id || product._id;
    if (id) { this.router.navigate(['/products', id]); }
  }

  quickAddToCart(product: any, e?: Event): void {
    if (e) e.stopPropagation();
    const pid = product.id || product._id;
    if (!pid) return;
    this.cartService.addToCart({ product_id: pid, quantity: 1, size: 'M', color: '' }).subscribe({
      next: () => this.showToast(product.name + ' added to cart! 🛍'),
      error: () => this.showToast('Failed to add to cart', true)
    });
  }

  showToast(message: string, error = false): void {
    this.toastMessage = message; this.toastError = error;
    setTimeout(() => this.toastMessage = '', 3000);
  }
}
