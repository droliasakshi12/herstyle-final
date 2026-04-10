import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  constructor(private auth: AuthService) {}

  generateReceipt(order: any) {
    const doc = new jsPDF();
    const user = this.auth.user();
    const customerName = order.customer_name || user?.name || 'Customer';
    const customerEmail = order.customer_email || user?.email || 'N/A';

    // --- LOGO / HEADER ---
    doc.setFontSize(28);
    doc.setTextColor(139, 104, 71); // Brown brand color
    doc.setFont('garamond', 'bold');
    doc.text('HerStyle', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text('Elegance in Every Stitch', 105, 26, { align: 'center' });

    // --- HORIZONTAL LINE ---
    doc.setDrawColor(220);
    doc.line(20, 32, 190, 32);

    // --- RECEIPT TITLE ---
    doc.setFontSize(16);
    doc.setTextColor(74, 55, 40); // Ink color
    doc.text('ORDER RECEIPT', 20, 45);

    // --- ORDER & CUSTOMER INFO ---
    doc.setFontSize(10);
    doc.setTextColor(80);
    
    // Left Column (Order Info)
    doc.text(`Order ID: #${order._id.substring(0, 8).toUpperCase()}`, 20, 55);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 60);
    doc.text(`Status: ${order.status.toUpperCase()}`, 20, 65);

    // Right Column (Customer Info)
    doc.text('Billed To:', 140, 55);
    doc.setFont('helvetica', 'bold');
    doc.text(customerName, 140, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(customerEmail, 140, 65);
    if (order.customer_phone) doc.text(`Phone: ${order.customer_phone}`, 140, 70);

    // --- SHIPPING ADDRESS ---
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text('Shipping Address:', 20, 80);
    doc.setFontSize(9);
    const splitAddress = doc.splitTextToSize(order.shipping_address, 80);
    doc.text(splitAddress, 20, 85);

    // --- ITEMS TABLE ---
    const tableData = order.items.map((item: any) => [
      item.name,
      `x${item.quantity}`,
      `₹${item.price.toLocaleString()}`,
      `₹${(item.price * item.quantity).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 105,
      head: [['Item Name', 'Qty', 'Unit Price', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [139, 104, 71], textColor: [255, 255, 255] },
      styles: { cellPadding: 5, fontSize: 9 },
      columnStyles: {
        2: { halign: 'right' },
        3: { halign: 'right' }
      }
    });

    // --- TOTAL SUMMARY ---
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(74, 55, 40);
    doc.text('Total Amount Paid:', 140, finalY, { align: 'right' });
    doc.setFontSize(14);
    doc.setTextColor(139, 104, 71);
    doc.text(`₹${order.total_amount.toLocaleString()}`, 190, finalY, { align: 'right' });

    // --- FOOTER ---
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for shopping with HerStyle!', 105, 280, { align: 'center' });

    // --- DOWNLOAD ---
    doc.save(`HerStyle_Receipt_${order._id.substring(0, 8)}.pdf`);
  }
}
