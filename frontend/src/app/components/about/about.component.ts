import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- HERO -->
    <section class="about-hero">
      <div class="hero-pattern"></div>
      <div class="hero-inner">
        <span class="hero-tag">Our Story</span>
        <h1>Fashion made<br><em>for her, by her.</em></h1>
        <p>Born in Surat, built for every woman — HerStyle is where tradition meets the modern wardrobe.</p>
      </div>
    </section>

    <!-- MISSION -->
    <section class="mission-section">
      <div class="container">
        <div class="mission-grid">
          <div class="mission-text">
            <span class="sec-tag">Who We Are</span>
            <h2>Celebrating Every<br>Woman's Style</h2>
            <p>HerStyle was founded with a simple belief — every woman deserves to feel beautiful in what she wears, without compromise. From vibrant ethnic kurtas to elegant western silhouettes, we curate pieces that speak to the soul of the modern Indian woman.</p>
            <p>Our team hand-picks every product, ensuring quality, comfort, and that special something that makes fashion feel personal.</p>
            <a routerLink="/products" class="btn-primary">Browse Collection</a>
          </div>
          <div class="mission-visual">
            <div class="visual-card v1">
              <div class="visual-icon">🌸</div>
              <strong>Handpicked</strong>
              <span>Every item curated with care</span>
            </div>
            <div class="visual-card v2">
              <div class="visual-icon">✨</div>
              <strong>Quality First</strong>
              <span>Premium fabrics & finishes</span>
            </div>
            <div class="visual-card v3">
              <div class="visual-icon">💛</div>
              <strong>Made for Her</strong>
              <span>Designed around real women</span>
            </div>
            <div class="visual-card v4">
              <div class="visual-icon">🚚</div>
              <strong>Fast Delivery</strong>
              <span>Pan-India shipping</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-row">
          <div class="stat">
            <span class="stat-num">500+</span>
            <span class="stat-label">Curated Styles</span>
          </div>
          <div class="stat-div"></div>
          <div class="stat">
            <span class="stat-num">50K+</span>
            <span class="stat-label">Happy Customers</span>
          </div>
          <div class="stat-div"></div>
          <div class="stat">
            <span class="stat-num">4.8★</span>
            <span class="stat-label">Average Rating</span>
          </div>
          <div class="stat-div"></div>
          <div class="stat">
            <span class="stat-num">Free</span>
            <span class="stat-label">Returns Always</span>
          </div>
        </div>
      </div>
    </section>

    <!-- VALUES -->
    <section class="values-section">
      <div class="container">
        <div class="sec-header">
          <span class="sec-tag">What We Stand For</span>
          <h2>Our Values</h2>
        </div>
        <div class="values-grid">
          <div class="value-card" *ngFor="let v of values">
            <div class="value-icon">{{ v.icon }}</div>
            <h3>{{ v.title }}</h3>
            <p>{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TEAM -->
    <section class="team-section">
      <div class="container">
        <div class="sec-header">
          <span class="sec-tag">The People</span>
          <h2>Meet Our Team</h2>
        </div>
        <div class="team-grid">
          <div class="team-card" *ngFor="let m of team">
            <div class="team-avatar">{{ m.initials }}</div>
            <h3>{{ m.name }}</h3>
            <span class="team-role">{{ m.role }}</span>
            <p>{{ m.bio }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-inner">
        <span class="ornament">✦</span>
        <h2>Ready to find your style?</h2>
        <p>Browse 500+ hand-picked pieces — new drops every week.</p>
        <div class="cta-btns">
          <a routerLink="/products" class="btn-primary">Shop Now</a>
          <a routerLink="/contact" class="btn-outline">Get in Touch</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { --brown:#8B6847; --brown-dark:#6B4F33; --beige:#F5EFE6; --beige-border:#E8DDD0; --ink:#4A3728; }

    /* HERO */
    .about-hero { background:linear-gradient(135deg,#f9f2e8 0%,#ede0ce 100%); padding:100px 40px 80px; text-align:center; position:relative; overflow:hidden; }
    .hero-pattern { position:absolute; inset:0; background-image:repeating-linear-gradient(45deg,rgba(139,104,71,.04) 0 1px,transparent 1px 40px); }
    .hero-inner { position:relative; max-width:680px; margin:0 auto; }
    .hero-tag { display:inline-block; background:rgba(139,104,71,.12); color:var(--brown); font-size:.78rem; font-weight:600; letter-spacing:2px; text-transform:uppercase; padding:6px 16px; border-radius:20px; margin-bottom:20px; }
    .about-hero h1 { font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(2.4rem,5vw,3.8rem); color:var(--ink); font-weight:600; line-height:1.2; margin:0 0 20px; }
    .about-hero h1 em { font-style:italic; color:var(--brown); }
    .about-hero p { color:#7a6655; font-size:1.05rem; max-width:500px; margin:0 auto; line-height:1.7; }

    /* COMMON */
    .container { max-width:1200px; margin:0 auto; padding:0 40px; }
    .sec-header { text-align:center; margin-bottom:48px; }
    .sec-tag { display:inline-block; background:rgba(139,104,71,.1); color:var(--brown); font-size:.78rem; font-weight:600; letter-spacing:2px; text-transform:uppercase; padding:5px 14px; border-radius:20px; margin-bottom:12px; }
    .sec-header h2 { font-family:'Cormorant Garamond',Georgia,serif; font-size:2.2rem; color:var(--ink); font-weight:600; margin:0; }
    .btn-primary { display:inline-block; background:var(--brown); color:white; padding:13px 28px; border-radius:8px; text-decoration:none; font-size:.88rem; font-weight:600; letter-spacing:.5px; transition:background .2s; }
    .btn-primary:hover { background:var(--brown-dark); }
    .btn-outline { display:inline-block; border:1.5px solid var(--brown); color:var(--brown); padding:12px 26px; border-radius:8px; text-decoration:none; font-size:.88rem; font-weight:600; transition:all .2s; }
    .btn-outline:hover { background:var(--beige); }

    /* MISSION */
    .mission-section { padding:80px 0; background:#FFFCF8; }
    .mission-grid { display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center; }
    .mission-text h2 { font-family:'Cormorant Garamond',Georgia,serif; font-size:2.2rem; color:var(--ink); font-weight:600; line-height:1.3; margin:0 0 20px; }
    .mission-text p { color:#7a6655; line-height:1.8; margin-bottom:16px; font-size:.95rem; }
    .mission-visual { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .visual-card { background:var(--beige); border:1px solid var(--beige-border); border-radius:12px; padding:24px 20px; display:flex; flex-direction:column; gap:6px; }
    .visual-icon { font-size:1.6rem; margin-bottom:4px; }
    .visual-card strong { font-size:.95rem; color:var(--ink); font-weight:600; }
    .visual-card span { font-size:.82rem; color:#9e8070; line-height:1.4; }

    /* STATS */
    .stats-section { padding:60px 0; background:var(--brown); }
    .stats-row { display:flex; align-items:center; justify-content:center; gap:0; flex-wrap:wrap; }
    .stat { text-align:center; padding:20px 48px; }
    .stat-num { display:block; font-family:'Cormorant Garamond',Georgia,serif; font-size:2.6rem; font-weight:700; color:white; line-height:1; }
    .stat-label { display:block; font-size:.8rem; color:rgba(255,255,255,.7); letter-spacing:1px; text-transform:uppercase; margin-top:4px; }
    .stat-div { width:1px; height:48px; background:rgba(255,255,255,.2); }

    /* VALUES */
    .values-section { padding:80px 0; background:#FFFCF8; }
    .values-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
    .value-card { background:white; border:1px solid var(--beige-border); border-radius:16px; padding:32px 28px; text-align:center; transition:box-shadow .2s; }
    .value-card:hover { box-shadow:0 8px 32px rgba(139,104,71,.1); }
    .value-icon { font-size:2rem; margin-bottom:12px; }
    .value-card h3 { font-size:1.05rem; color:var(--ink); font-weight:600; margin:0 0 10px; }
    .value-card p { font-size:.88rem; color:#9e8070; line-height:1.6; margin:0; }

    /* TEAM */
    .team-section { padding:80px 0; background:var(--beige); }
    .team-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
    .team-card { background:white; border-radius:16px; padding:36px 24px; text-align:center; border:1px solid var(--beige-border); }
    .team-avatar { width:72px; height:72px; border-radius:50%; background:var(--brown); color:white; font-size:1.4rem; font-weight:700; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
    .team-card h3 { font-size:1.05rem; color:var(--ink); font-weight:600; margin:0 0 4px; }
    .team-role { font-size:.8rem; color:var(--brown); font-weight:600; letter-spacing:.5px; text-transform:uppercase; }
    .team-card p { font-size:.88rem; color:#9e8070; line-height:1.6; margin:12px 0 0; }

    /* CTA */
    .cta-section { padding:80px 40px; background:linear-gradient(135deg,#4A3728 0%,#8B6847 100%); text-align:center; }
    .cta-inner { max-width:560px; margin:0 auto; }
    .ornament { font-size:1.4rem; color:rgba(255,255,255,.6); display:block; margin-bottom:16px; }
    .cta-inner h2 { font-family:'Cormorant Garamond',Georgia,serif; font-size:2.4rem; color:white; font-weight:600; margin:0 0 12px; }
    .cta-inner p { color:rgba(255,255,255,.75); font-size:1rem; margin:0 0 32px; }
    .cta-btns { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }
    .cta-section .btn-primary { background:white; color:var(--brown); }
    .cta-section .btn-primary:hover { background:#f5efe6; }
    .cta-section .btn-outline { border-color:rgba(255,255,255,.5); color:white; }
    .cta-section .btn-outline:hover { background:rgba(255,255,255,.1); }

    @media(max-width:900px) {
      .mission-grid { grid-template-columns:1fr; }
      .values-grid,.team-grid { grid-template-columns:1fr 1fr; }
    }
    @media(max-width:600px) {
      .container { padding:0 20px; }
      .about-hero { padding:70px 20px 60px; }
      .values-grid,.team-grid { grid-template-columns:1fr; }
      .stat { padding:16px 24px; }
    }
  `]
})
export class AboutComponent {
  values = [
    { icon:'🌿', title:'Sustainability', desc:'We source responsibly and partner with artisans who care as much as we do about the planet.' },
    { icon:'💎', title:'Quality', desc:'Every stitch, every fabric, every finish goes through our quality check before reaching you.' },
    { icon:'🤝', title:'Inclusivity', desc:'Fashion for every size, every shade, every occasion. HerStyle celebrates all women.' },
    { icon:'🔄', title:'Easy Returns', desc:'Changed your mind? No problem. Free returns on all orders, no questions asked.' },
    { icon:'🛡️', title:'Safe Shopping', desc:'Your data and payment are fully secure. We use industry-standard encryption.' },
    { icon:'💬', title:'Community', desc:'Join thousands of HerStyle women sharing looks, tips, and style inspiration.' },
  ];

  team = [
    { initials:'PR', name:'Priya Reddy', role:'Founder & CEO', bio:'Passionate about making quality fashion accessible to every Indian woman. Former fashion designer turned entrepreneur.' },
    { initials:'MG', name:'Meera Gupta', role:'Head of Curation', bio:'10+ years in fashion retail. Meera hand-picks every collection with an eye for trend and timelessness.' },
    { initials:'AS', name:'Ananya Shah', role:'Customer Experience', bio:'Ensures every HerStyle customer feels seen and supported — from first click to delivery at the door.' },
  ];
}
