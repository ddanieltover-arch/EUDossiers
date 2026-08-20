import { jsPDF } from 'jspdf';
import ogImageUrl from '../../og-image.png';
import { Order } from '../types';
import {
  SITE_TAGLINE,
  CONTACT_EMAIL,
  PRIVACY_EMAIL,
  LEGAL_NAME,
  DOMAIN,
  ADDRESS_LINE,
  EXPORT_PREFIX,
} from '../brand';
import { EU_COUNTRIES } from '../data/mockData';

const NAVY: [number, number, number] = [11, 31, 51];
const INK: [number, number, number] = [7, 20, 33];
const SLATE: [number, number, number] = [42, 74, 102];
const MUTED: [number, number, number] = [143, 168, 192];
const TEAL: [number, number, number] = [20, 184, 166];
const TEAL_DARK: [number, number, number] = [15, 118, 110];
const PAPER: [number, number, number] = [245, 247, 250];
const BORDER: [number, number, number] = [220, 227, 236];
const WHITE: [number, number, number] = [255, 255, 255];
const EMERALD: [number, number, number] = [16, 185, 129];
const BLUE: [number, number, number] = [26, 86, 255];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 16;

function formatEur(value: number): string {
  return `${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function countryLabel(code: string): string {
  const match = EU_COUNTRIES.find(c => c.code === code);
  return match ? `${match.name} (${code})` : code;
}

function paymentLabel(order: Order): string {
  if (order.paymentMethod === 'crypto') return 'Cryptocurrency';
  if (order.paymentMethod === 'bank') return 'Bank Transfer';
  return 'EUR Settlement';
}

function wrapLines(doc: jsPDF, text: string, width: number): string[] {
  return doc.splitTextToSize(text, width) as string[];
}

async function loadLogoDataUrl(): Promise<{ dataUrl: string; ratio: number }> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.crossOrigin = 'anonymous';
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Could not load brand logo'));
    el.src = ogImageUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is unavailable');
  ctx.drawImage(img, 0, 0);

  return {
    dataUrl: canvas.toDataURL('image/png'),
    ratio: img.naturalWidth / img.naturalHeight,
  };
}

function drawFooter(doc: jsPDF, page: number, total: number) {
  doc.setFillColor(...NAVY);
  doc.rect(0, PAGE_H - 18, PAGE_W, 18, 'F');
  doc.setFillColor(...TEAL);
  doc.rect(0, PAGE_H - 20, PAGE_W, 2, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...WHITE);
  doc.text(
    `${LEGAL_NAME}  ·  ${ADDRESS_LINE}  ·  ${DOMAIN}  ·  VAT ID DE000000000`,
    MARGIN,
    PAGE_H - 8,
  );
  doc.text(`Page ${page} of ${total}`, PAGE_W - MARGIN, PAGE_H - 8, { align: 'right' });
}

export async function downloadOfficialEuInvoice(order: Order): Promise<void> {
  const logo = await loadLogoDataUrl();
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  // --- Header band ---
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_W, 42, 'F');
  doc.setFillColor(...TEAL);
  doc.rect(0, 42, PAGE_W, 2.2, 'F');

  const logoH = 22;
  const logoW = Math.min(72, logoH * logo.ratio);
  doc.setFillColor(...WHITE);
  doc.roundedRect(MARGIN - 1.5, 8.5, logoW + 5, logoH + 5, 2, 2, 'F');
  doc.addImage(logo.dataUrl, 'PNG', MARGIN, 11, logoW, logoH, undefined, 'FAST');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...WHITE);
  doc.text('OFFICIAL EU INVOICE', PAGE_W - MARGIN, 18, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...TEAL);
  doc.text('TAX INVOICE  ·  EUR SETTLEMENT', PAGE_W - MARGIN, 25, { align: 'right' });

  doc.setTextColor(180, 198, 214);
  doc.text(SITE_TAGLINE, PAGE_W - MARGIN, 31, { align: 'right' });

  // --- Meta row ---
  let y = 52;
  doc.setFillColor(...PAPER);
  doc.roundedRect(MARGIN, y, PAGE_W - MARGIN * 2, 22, 2, 2, 'F');

  const colW = (PAGE_W - MARGIN * 2) / 4;
  const metaCols = [
    { label: 'INVOICE REFERENCE', value: order.id, color: BLUE },
    { label: 'INVOICE DATE', value: formatDate(order.createdAt), color: INK },
    { label: 'PAYMENT METHOD', value: paymentLabel(order), color: INK },
    { label: 'STATUS', value: order.status === 'COMPLETED' ? 'PAID / SETTLED' : order.status, color: EMERALD },
  ];

  metaCols.forEach((col, i) => {
    const x = MARGIN + 5 + i * colW;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text(col.label, x, y + 7);
    doc.setFontSize(9);
    doc.setTextColor(...col.color);
    const valueLines = wrapLines(doc, col.value, colW - 8);
    doc.text(valueLines[0], x, y + 15);
  });

  // --- Parties ---
  y = 82;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...TEAL_DARK);
  doc.text('FROM (SELLER)', MARGIN, y);
  doc.text('BILL TO / SHIP TO (CUSTOMER)', 112, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text(`${LEGAL_NAME} GmbH`, MARGIN, y);
  doc.text(order.customerName || 'Customer', 112, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...SLATE);

  const sellerLines = [
    'Friedrichstrasse 123',
    `10117 Berlin, ${ADDRESS_LINE}`,
    CONTACT_EMAIL,
    `www.${DOMAIN}`,
    'VAT ID: DE000000000',
  ];

  const buyerLines: string[] = [];
  if (order.customerEmail) buyerLines.push(order.customerEmail);
  if (order.customerPhone) buyerLines.push(`Phone: ${order.customerPhone}`);
  if (order.customerAddress) {
    wrapLines(doc, `Address: ${order.customerAddress}`, 80).forEach(line => buyerLines.push(line));
  }
  buyerLines.push(`Destination VAT country: ${countryLabel(order.destinationCountry)}`);
  buyerLines.push(`Payment: ${paymentLabel(order)}`);
  buyerLines.push(order.gdprConsentRecorded
    ? 'GDPR consent recorded at checkout (Art. 6)'
    : 'GDPR consent not recorded');

  sellerLines.forEach((line, i) => doc.text(line, MARGIN, y + 6 + i * 5));
  buyerLines.forEach((line, i) => doc.text(line, 112, y + 6 + i * 5));

  const partiesHeight = Math.max(sellerLines.length, buyerLines.length) * 5;
  y += 8 + partiesHeight;

  // --- Line items table ---
  y += 4;
  const colX = {
    desc: MARGIN,
    sku: 108,
    qty: 136,
    unit: 150,
    amount: PAGE_W - MARGIN,
  };
  const tableWidth = PAGE_W - MARGIN * 2;

  doc.setFillColor(...NAVY);
  doc.roundedRect(MARGIN, y, tableWidth, 9, 1.2, 1.2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...WHITE);
  doc.text('DESCRIPTION', colX.desc + 3, y + 6);
  doc.text('SKU', colX.sku, y + 6);
  doc.text('QTY', colX.qty, y + 6);
  doc.text('UNIT PRICE', colX.unit, y + 6);
  doc.text('AMOUNT', colX.amount, y + 6, { align: 'right' });

  y += 9;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  order.items.forEach((item, idx) => {
    const rowH = 12;
    if (y + rowH > PAGE_H - 78) {
      doc.addPage();
      y = 24;
    }
    if (idx % 2 === 0) {
      doc.setFillColor(250, 252, 253);
      doc.rect(MARGIN, y, tableWidth, rowH, 'F');
    }
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y + rowH, MARGIN + tableWidth, y + rowH);

    doc.setTextColor(...INK);
    const name = doc.splitTextToSize(item.name, 86);
    doc.text(name[0], colX.desc + 3, y + 7.5);
    doc.setTextColor(...SLATE);
    doc.text(item.sku, colX.sku, y + 7.5);
    doc.text(String(item.quantity), colX.qty, y + 7.5);
    doc.text(formatEur(item.unitPriceEUR), colX.unit, y + 7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...INK);
    doc.text(formatEur(item.totalPriceEUR), colX.amount, y + 7.5, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    y += rowH;
  });

  // --- Totals ---
  y += 8;
  const boxW = 78;
  const boxX = PAGE_W - MARGIN - boxW;
  const rows: { label: string; value: string; emphasize?: boolean; teal?: boolean }[] = [
    { label: 'Subtotal', value: formatEur(order.subtotalEUR) },
  ];
  if (order.cryptoDiscountEUR && order.cryptoDiscountEUR > 0) {
    rows.push({ label: 'Crypto discount (5%)', value: `-${formatEur(order.cryptoDiscountEUR)}` });
  }

  rows.forEach((row, i) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...SLATE);
    doc.text(row.label, boxX, y + i * 6);
    doc.setTextColor(...INK);
    doc.text(row.value, PAGE_W - MARGIN, y + i * 6, { align: 'right' });
  });

  y += rows.length * 6 + 3;
  doc.setFillColor(...TEAL);
  doc.roundedRect(boxX - 3, y - 5, boxW + 3, 14, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...WHITE);
  doc.text('TOTAL SETTLED (EUR)', boxX, y + 3.5);
  doc.setFontSize(11);
  doc.text(formatEur(order.totalEUR), PAGE_W - MARGIN, y + 3.5, { align: 'right' });

  y += 16;
  if (order.paidCurrency !== 'EUR') {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...BLUE);
    doc.text(
      `Display reference: ${order.paidCurrencySymbol}${order.paidAmountConverted.toFixed(2)} ${order.paidCurrency}  ·  FX ${order.exchangeRateUsed}`,
      PAGE_W - MARGIN,
      y,
      { align: 'right' },
    );
    y += 8;
  }

  // --- Legal / GDPR ---
  if (y > PAGE_H - 62) {
    doc.addPage();
    y = 24;
  }

  doc.setFillColor(239, 246, 255);
  doc.roundedRect(MARGIN, y, tableWidth, 28, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...BLUE);
  doc.text('GDPR & VAT NOTICE', MARGIN + 4, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(...SLATE);
  const notice = doc.splitTextToSize(
    `This document is an official tax invoice for goods settled in Euro (EUR). Personal data on this invoice is processed under Regulation (EU) 2016/679 (GDPR), Art. 6(1)(b) and (c), solely for contract performance and statutory accounting. Data is hosted in Frankfurt, Germany (EU-West). Privacy requests: ${PRIVACY_EMAIL}.`,
    tableWidth - 8,
  );
  doc.text(notice, MARGIN + 4, y + 13);

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  doc.save(`Invoice_${order.id}_${EXPORT_PREFIX}.pdf`);
}
