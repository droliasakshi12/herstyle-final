import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="brand-logo">✦ HerStyle</div>
          <p>Style made for her — curated fashion for the modern Indian woman.</p>
        </div>
        <div class="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><a routerLink="/products">All Products</a></li>
            <li><a routerLink="/products">New Arrivals</a></li>
            <li><a routerLink="/products">Featured</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Help</h4>
          <ul>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Size Guide</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Follow Us</h4>
          <ul>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Pinterest</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 HerStyle. Made with care for every woman.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer { background:#4A3728; color:#D4C4B5; }
    .footer-top { max-width:1280px; margin:0 auto; padding:52px 40px 40px; display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:48px; }
    .brand-logo { font-family:'Cormorant Garamond',Georgia,serif; font-size:1.6rem; font-weight:500; color:#C4A882; margin-bottom:12px; letter-spacing:0.5px; }
    .footer-brand p { font-size:0.88rem; line-height:1.7; opacity:0.75; }
    .footer-col h4 { font-family:'Jost',sans-serif; font-size:0.72rem; letter-spacing:2px; text-transform:uppercase; color:#C4A882; margin-bottom:18px; font-weight:500; }
    .footer-col ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; }
    .footer-col a { color:#B8A898; font-size:0.88rem; text-decoration:none; transition:color 0.2s; }
    .footer-col a:hover { color:#C4A882; }
    .footer-bottom { border-top:1px solid rgba(255,255,255,0.08); text-align:center; padding:18px 40px; font-size:0.8rem; opacity:0.55; }
    @media(max-width:768px) { .footer-top { grid-template-columns:1fr 1fr; gap:32px; padding:36px 24px 28px; } }
  `]
})
export class FooterComponent {}
