import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- HERO -->
    <section class="contact-hero">
      <div class="hero-pattern"></div>
      <div class="hero-inner">
        <span class="hero-tag">Get in Touch</span>
        <h1>We'd love to<br><em>hear from you.</em></h1>
        <p>Questions, feedback or just want to say hello? We're always here for our HerStyle family.</p>
      </div>
    </section>

    <section class="contact-section">
      <div class="container">
        <div class="contact-grid">

          <!-- FORM -->
          <div class="contact-form-wrap">
            <h2>Send us a message</h2>
            <p class="form-sub">We typically respond within 24 hours.</p>

            @if (submitted) {
              <div class="success-card">
                <span class="success-icon">✅</span>
                <h3>Message Sent!</h3>
                <p>Thank you, {{ form.name }}! We've received your message and will get back to you at <strong>{{ form.email }}</strong> soon.</p>
                <button class="btn-outline" (click)="resetForm()">Send Another Message</button>
              </div>
            } @else {
              <form class="contact-form" (ngSubmit)="submitForm()" #f="ngForm">
                @if (error) {
                  <div class="error-banner">{{ error }}</div>
                }
                <div class="form-row">
                  <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" [(ngModel)]="form.name" name="name" placeholder="Priya Sharma" required [class.invalid]="submitted2 && !form.name" />
                  </div>
                  <div class="form-group">
                    <label>Email Address *</label>
                    <input type="email" [(ngModel)]="form.email" name="email" placeholder="priya@email.com" required [class.invalid]="submitted2 && !form.email" />
                  </div>
                </div>
                <div class="form-group">
                  <label>Subject *</label>
                  <select [(ngModel)]="form.subject" name="subject" required [class.invalid]="submitted2 && !form.subject">
                    <option value="">Select a topic…</option>
                    <option value="Order Query">Order Query</option>
                    <option value="Return & Exchange">Return &amp; Exchange</option>
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Message *</label>
                  <textarea [(ngModel)]="form.message" name="message" rows="5" placeholder="Tell us how we can help…" required [class.invalid]="submitted2 && !form.message"></textarea>
                </div>
                <button type="submit" class="btn-primary" [disabled]="loading">
                  @if (loading) { <span class="spinner"></span> Sending… }
                  @else { Send Message → }
                </button>
              </form>
            }
          </div>

          <!-- INFO -->
          <div class="contact-info">
            <div class="info-card">
              <h3>Contact Details</h3>
              <div class="info-item" *ngFor="let item of infoItems">
                <div class="info-icon">{{ item.icon }}</div>
                <div>
                  <strong>{{ item.label }}</strong>
                  <span>{{ item.value }}</span>
                </div>
              </div>
            </div>

            <div class="info-card">
              <h3>Business Hours</h3>
              <div class="hours-row" *ngFor="let h of hours">
                <span class="day">{{ h.day }}</span>
                <span class="time" [class.closed]="h.closed">{{ h.time }}</span>
              </div>
            </div>

            <div class="info-card faq-card">
              <h3>Quick Help</h3>
              <div class="faq-item" *ngFor="let q of faqs" (click)="q.open = !q.open">
                <div class="faq-q">
                  <span>{{ q.q }}</span>
                  <span class="faq-toggle">{{ q.open ? '−' : '+' }}</span>
                </div>
                @if (q.open) {
                  <div class="faq-a">{{ q.a }}</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { --brown:#8B6847; --brown-dark:#6B4F33; --beige:#F5EFE6; --beige-border:#E8DDD0; --ink:#4A3728; }
    .contact-hero { background:linear-gradient(135deg,#f9f2e8 0%,#ede0ce 100%); padding:100px 40px 80px; text-align:center; position:relative; overflow:hidden; }
    .hero-pattern { position:absolute; inset:0; background-image:repeating-linear-gradient(45deg,rgba(139,104,71,.04) 0 1px,transparent 1px 40px); }
    .hero-inner { position:relative; max-width:600px; margin:0 auto; }
    .hero-tag { display:inline-block; background:rgba(139,104,71,.12); color:var(--brown); font-size:.78rem; font-weight:600; letter-spacing:2px; text-transform:uppercase; padding:6px 16px; border-radius:20px; margin-bottom:20px; }
    .contact-hero h1 { font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(2.2rem,5vw,3.6rem); color:var(--ink); font-weight:600; line-height:1.2; margin:0 0 20px; }
    .contact-hero h1 em { font-style:italic; color:var(--brown); }
    .contact-hero p { color:#7a6655; font-size:1rem; line-height:1.7; }

    .contact-section { padding:80px 0; background:#FFFCF8; }
    .container { max-width:1200px; margin:0 auto; padding:0 40px; }
    .contact-grid { display:grid; grid-template-columns:1fr 400px; gap:48px; align-items:start; }

    /* FORM */
    .contact-form-wrap h2 { font-family:'Cormorant Garamond',Georgia,serif; font-size:1.8rem; color:var(--ink); font-weight:600; margin:0 0 6px; }
    .form-sub { color:#9e8070; font-size:.88rem; margin:0 0 28px; }
    .contact-form { display:flex; flex-direction:column; gap:20px; }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .form-group { display:flex; flex-direction:column; gap:6px; }
    .form-group label { font-size:.82rem; font-weight:600; color:var(--ink); letter-spacing:.3px; }
    .form-group input,.form-group select,.form-group textarea { padding:12px 14px; border:1.5px solid var(--beige-border); border-radius:8px; font-size:.92rem; color:var(--ink); background:white; font-family:inherit; transition:border-color .2s; outline:none; resize:vertical; }
    .form-group input:focus,.form-group select:focus,.form-group textarea:focus { border-color:var(--brown); }
    .form-group input.invalid,.form-group select.invalid,.form-group textarea.invalid { border-color:#f87171; }
    .btn-primary { display:flex; align-items:center; gap:8px; justify-content:center; background:var(--brown); color:white; padding:14px 28px; border-radius:8px; border:none; font-size:.92rem; font-weight:600; cursor:pointer; transition:background .2s; font-family:inherit; letter-spacing:.3px; }
    .btn-primary:hover:not(:disabled) { background:var(--brown-dark); }
    .btn-primary:disabled { opacity:.65; cursor:not-allowed; }
    .spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,.4); border-top-color:white; border-radius:50%; animation:spin .7s linear infinite; }
    @keyframes spin { to { transform:rotate(360deg); } }
    .error-banner { background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:12px 16px; border-radius:8px; font-size:.85rem; }
    .success-card { background:var(--beige); border:1px solid var(--beige-border); border-radius:16px; padding:48px 32px; text-align:center; }
    .success-icon { font-size:3rem; display:block; margin-bottom:16px; }
    .success-card h3 { font-size:1.4rem; color:var(--ink); font-weight:600; margin:0 0 12px; }
    .success-card p { color:#7a6655; font-size:.92rem; line-height:1.7; margin:0 0 24px; }
    .btn-outline { display:inline-block; border:1.5px solid var(--brown); color:var(--brown); padding:10px 22px; border-radius:8px; background:none; font-family:inherit; font-size:.88rem; font-weight:600; cursor:pointer; transition:all .2s; text-decoration:none; }
    .btn-outline:hover { background:var(--beige); }

    /* INFO */
    .contact-info { display:flex; flex-direction:column; gap:20px; }
    .info-card { background:white; border:1px solid var(--beige-border); border-radius:16px; padding:28px; }
    .info-card h3 { font-size:1rem; font-weight:600; color:var(--ink); margin:0 0 20px; text-transform:uppercase; letter-spacing:.8px; font-size:.82rem; }
    .info-item { display:flex; gap:14px; align-items:flex-start; margin-bottom:16px; }
    .info-item:last-child { margin-bottom:0; }
    .info-icon { font-size:1.3rem; flex-shrink:0; margin-top:2px; }
    .info-item strong { display:block; font-size:.88rem; color:var(--ink); font-weight:600; margin-bottom:2px; }
    .info-item span { font-size:.85rem; color:#9e8070; line-height:1.5; }
    .hours-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--beige-border); font-size:.88rem; }
    .hours-row:last-child { border-bottom:none; }
    .day { color:var(--ink); font-weight:500; }
    .time { color:var(--brown); font-weight:600; }
    .time.closed { color:#d1a090; font-weight:400; }
    .faq-item { border-bottom:1px solid var(--beige-border); padding:12px 0; cursor:pointer; }
    .faq-item:last-child { border-bottom:none; }
    .faq-q { display:flex; justify-content:space-between; align-items:center; font-size:.88rem; font-weight:500; color:var(--ink); gap:12px; }
    .faq-toggle { font-size:1.2rem; color:var(--brown); flex-shrink:0; }
    .faq-a { font-size:.84rem; color:#9e8070; line-height:1.6; margin-top:8px; }

    @media(max-width:900px) {
      .contact-grid { grid-template-columns:1fr; }
      .contact-info { order:-1; }
    }
    @media(max-width:600px) {
      .container { padding:0 20px; }
      .contact-hero { padding:70px 20px 60px; }
      .form-row { grid-template-columns:1fr; }
    }
  `]
})
export class ContactComponent {
  form = { name: '', email: '', subject: '', message: '' };
  loading = false;
  submitted = false;
  submitted2 = false;
  error = '';

  infoItems = [
    { icon:'📍', label:'Address', value:'HerStyle HQ, Ring Road, Surat, Gujarat – 395002' },
    { icon:'📧', label:'Email', value:'hello@herstyle.in' },
    { icon:'📞', label:'Phone', value:'+91 98765 43210' },
    { icon:'💬', label:'WhatsApp', value:'+91 98765 43210 (Chat only)' },
  ];

  hours = [
    { day:'Mon – Fri', time:'10:00 AM – 7:00 PM' },
    { day:'Saturday', time:'11:00 AM – 6:00 PM' },
    { day:'Sunday', time:'Closed', closed: true },
  ];

  faqs = [
    { q:'How long does delivery take?', a:'Standard delivery takes 3–5 business days. Express shipping (1–2 days) is available at checkout.', open: false },
    { q:'Can I return an item?', a:'Yes! Free returns within 15 days of delivery. Items must be unworn with original tags.', open: false },
    { q:'How do I track my order?', a:'Once shipped, you\'ll receive a tracking link via email and SMS automatically.', open: false },
  ];

  constructor(private http: HttpClient) {}

  submitForm() {
    this.submitted2 = true;
    if (!this.form.name || !this.form.email || !this.form.subject || !this.form.message) return;
    this.loading = true;
    this.error = '';
    this.http.post(`${environment.apiUrl}/contact`, this.form).subscribe({
      next: () => { this.submitted = true; this.loading = false; },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to send message. Please try again.';
        this.loading = false;
      }
    });
  }

  resetForm() {
    this.form = { name:'', email:'', subject:'', message:'' };
    this.submitted = false;
    this.submitted2 = false;
    this.error = '';
  }
}
