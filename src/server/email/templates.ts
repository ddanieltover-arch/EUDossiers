import { CONTACT_EMAIL, DOMAIN, LEGAL_FOOTER, SITE_NAME, SITE_TAGLINE } from '../../brand';
import { Order } from '../../types';
import { EMAIL_BRAND, getLogoSrc } from './config';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatEur(value: number): string {
  return `${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function paymentLabel(method?: string): string {
  if (method === 'crypto') return 'Cryptocurrency (5% discount)';
  if (method === 'bank') return 'Bank transfer';
  return 'Not specified';
}

export function statusLabel(status: Order['status']): string {
  if (status === 'PROCESSING') return 'Processing';
  if (status === 'COMPLETED') return 'Completed';
  return 'Cancelled';
}

export const CONTACT_SUBJECT_LABELS: Record<string, string> = {
  order: 'Order enquiry',
  product: 'Product information',
  shipping: 'Shipping & delivery',
  returns: 'Returns & refunds',
  gdpr: 'GDPR / data privacy request',
  partnership: 'Business & partnership',
  other: 'Other',
};

function wrapEmail(options: {
  preheader: string;
  eyebrow: string;
  title: string;
  intro: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaHref?: string;
}): string {
  const { src: logoSrc } = getLogoSrc();
  const cta = options.ctaLabel && options.ctaHref
    ? `
      <tr>
        <td style="padding: 8px 32px 28px;">
          <a href="${escapeHtml(options.ctaHref)}" style="display:inline-block;background:${EMAIL_BRAND.tealDark};color:${EMAIL_BRAND.white};text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:10px;">
            ${escapeHtml(options.ctaLabel)}
          </a>
        </td>
      </tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(options.title)}</title>
</head>
<body style="margin:0;padding:0;background:${EMAIL_BRAND.paper};font-family:'Source Sans 3',Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${EMAIL_BRAND.ink};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(options.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL_BRAND.paper};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${EMAIL_BRAND.white};border-radius:16px;overflow:hidden;border:1px solid ${EMAIL_BRAND.border};">
          <tr>
            <td style="background:${EMAIL_BRAND.ink};padding:0;">
              <img src="${logoSrc}" alt="${escapeHtml(SITE_NAME)}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="height:4px;background:${EMAIL_BRAND.teal};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${EMAIL_BRAND.tealDark};font-weight:700;">${escapeHtml(options.eyebrow)}</p>
              <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;color:${EMAIL_BRAND.ink};font-family:Outfit,Segoe UI,sans-serif;">${escapeHtml(options.title)}</h1>
              <p style="margin:0;font-size:15px;line-height:1.6;color:${EMAIL_BRAND.slate};">${options.intro}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 8px;">${options.bodyHtml}</td>
          </tr>
          ${cta}
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid ${EMAIL_BRAND.border};">
              <p style="margin:0 0 6px;font-size:13px;color:${EMAIL_BRAND.slate};">${escapeHtml(SITE_NAME)} · ${escapeHtml(SITE_TAGLINE)}</p>
              <p style="margin:0;font-size:12px;color:${EMAIL_BRAND.muted};">${escapeHtml(LEGAL_FOOTER)}<br />${escapeHtml(DOMAIN)} · ${escapeHtml(CONTACT_EMAIL)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function kvTable(rows: Array<[string, string]>): string {
  const cells = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;font-size:13px;color:${EMAIL_BRAND.muted};width:38%;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;font-size:13px;color:${EMAIL_BRAND.ink};font-weight:600;">${value}</td>
        </tr>`
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${cells}</table>`;
}

function orderItemsHtml(order: Order): string {
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${EMAIL_BRAND.border};">
            <div style="font-size:14px;color:${EMAIL_BRAND.ink};font-weight:700;">${escapeHtml(item.name)}</div>
            <div style="font-size:12px;color:${EMAIL_BRAND.muted};">SKU ${escapeHtml(item.sku)} · Qty ${item.quantity}</div>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid ${EMAIL_BRAND.border};text-align:right;font-size:14px;color:${EMAIL_BRAND.ink};font-weight:700;white-space:nowrap;">${formatEur(item.totalPriceEUR)}</td>
        </tr>`
    )
    .join('');

  const cryptoRow =
    order.cryptoDiscountEUR && order.cryptoDiscountEUR > 0
      ? `<tr>
          <td style="padding:6px 0;font-size:13px;color:${EMAIL_BRAND.tealDark};">Crypto discount</td>
          <td style="padding:6px 0;text-align:right;font-size:13px;color:${EMAIL_BRAND.tealDark};">-${formatEur(order.cryptoDiscountEUR)}</td>
        </tr>`
      : '';

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
      <tr>
        <td style="padding:6px 0;font-size:13px;color:${EMAIL_BRAND.slate};">Subtotal</td>
        <td style="padding:6px 0;text-align:right;font-size:13px;color:${EMAIL_BRAND.ink};">${formatEur(order.subtotalEUR)}</td>
      </tr>
      ${cryptoRow}
      <tr>
        <td style="padding:10px 0 0;font-size:15px;color:${EMAIL_BRAND.ink};font-weight:800;">Total</td>
        <td style="padding:10px 0 0;text-align:right;font-size:15px;color:${EMAIL_BRAND.tealDark};font-weight:800;">${formatEur(order.totalEUR)}</td>
      </tr>
    </table>`;
}

function orderSummaryHtml(order: Order): string {
  return `
    ${kvTable([
      ['Order reference', `<span style="font-family:ui-monospace,Consolas,monospace;">${escapeHtml(order.id)}</span>`],
      ['Status', escapeHtml(statusLabel(order.status))],
      ['Customer', escapeHtml(order.customerName)],
      ['Email', escapeHtml(order.customerEmail)],
      ['Phone', escapeHtml(order.customerPhone || '—')],
      ['Address', escapeHtml(order.customerAddress || '—')],
      ['Destination', escapeHtml(order.destinationCountry)],
      ['Payment', escapeHtml(paymentLabel(order.paymentMethod))],
      ['Placed', escapeHtml(formatDate(order.createdAt))],
    ])}
    <div style="height:16px;"></div>
    ${orderItemsHtml(order)}`;
}

export function customerOrderConfirmationEmail(order: Order): { subject: string; html: string; text: string } {
  const paymentNote =
    order.paymentMethod === 'crypto'
      ? 'Our team will email cryptocurrency payment instructions shortly. A 5% settlement discount is already applied.'
      : `Please complete payment by bank transfer. Quote <strong>${escapeHtml(order.id)}</strong> as the payment reference. Our team will also follow up at ${escapeHtml(CONTACT_EMAIL)}.`;

  return {
    subject: `${SITE_NAME} order confirmed · ${order.id}`,
    html: wrapEmail({
      preheader: `Your ${SITE_NAME} order ${order.id} has been received.`,
      eyebrow: 'Order confirmation',
      title: `Thank you, ${order.customerName}`,
      intro: `We have received your order <strong>${escapeHtml(order.id)}</strong> and it is now <strong>${escapeHtml(statusLabel(order.status))}</strong>. ${paymentNote}`,
      bodyHtml: orderSummaryHtml(order),
    }),
    text: [
      `Your ${SITE_NAME} order ${order.id} has been received.`,
      `Status: ${statusLabel(order.status)}`,
      `Total: ${formatEur(order.totalEUR)}`,
      `We will contact you at ${order.customerEmail}.`,
    ].join('\n'),
  };
}

export function adminNewOrderEmail(order: Order): { subject: string; html: string; text: string } {
  return {
    subject: `New ${SITE_NAME} order · ${order.id} · ${formatEur(order.totalEUR)}`,
    html: wrapEmail({
      preheader: `${order.customerName} placed order ${order.id}.`,
      eyebrow: 'Merchant alert',
      title: 'New order received',
      intro: `<strong>${escapeHtml(order.customerName)}</strong> placed an order for <strong>${formatEur(order.totalEUR)}</strong>. Review fulfilment in the admin portal.`,
      bodyHtml: orderSummaryHtml(order),
    }),
    text: `New order ${order.id} from ${order.customerName} (${order.customerEmail}) for ${formatEur(order.totalEUR)}.`,
  };
}

export function customerOrderUpdateEmail(
  order: Order,
  previousStatus?: Order['status']
): { subject: string; html: string; text: string } {
  const statusChanged = previousStatus && previousStatus !== order.status;
  const intro = statusChanged
    ? `The status of order <strong>${escapeHtml(order.id)}</strong> has changed from <strong>${escapeHtml(statusLabel(previousStatus))}</strong> to <strong>${escapeHtml(statusLabel(order.status))}</strong>.`
    : `Your order <strong>${escapeHtml(order.id)}</strong> has been updated by our team. Current status: <strong>${escapeHtml(statusLabel(order.status))}</strong>.`;

  return {
    subject: `${SITE_NAME} order update · ${order.id} is now ${statusLabel(order.status)}`,
    html: wrapEmail({
      preheader: `Order ${order.id} is now ${statusLabel(order.status)}.`,
      eyebrow: 'Order update',
      title: 'Your order has been updated',
      intro,
      bodyHtml: orderSummaryHtml(order),
    }),
    text: `Order ${order.id} update. Status: ${statusLabel(order.status)}. Total: ${formatEur(order.totalEUR)}.`,
  };
}

export function adminOrderUpdateEmail(
  order: Order,
  previousStatus?: Order['status']
): { subject: string; html: string; text: string } {
  return {
    subject: `Order updated · ${order.id} · ${statusLabel(order.status)}`,
    html: wrapEmail({
      preheader: `Order ${order.id} was updated in the merchant portal.`,
      eyebrow: 'Merchant alert',
      title: 'Order record updated',
      intro: previousStatus && previousStatus !== order.status
        ? `Order <strong>${escapeHtml(order.id)}</strong> changed from <strong>${escapeHtml(statusLabel(previousStatus))}</strong> to <strong>${escapeHtml(statusLabel(order.status))}</strong>.`
        : `Order <strong>${escapeHtml(order.id)}</strong> details were updated in the inventory portal.`,
      bodyHtml: orderSummaryHtml(order),
    }),
    text: `Order ${order.id} updated. Status: ${statusLabel(order.status)}. Customer: ${order.customerEmail}.`,
  };
}

export function customerContactAckEmail(input: {
  name: string;
  subjectLabel: string;
  message: string;
}): { subject: string; html: string; text: string } {
  return {
    subject: `We received your message · ${SITE_NAME}`,
    html: wrapEmail({
      preheader: 'Our EU team will reply within 1–2 business days.',
      eyebrow: 'Contact confirmation',
      title: `Thanks for writing, ${input.name}`,
      intro: `We have received your enquiry about <strong>${escapeHtml(input.subjectLabel)}</strong>. A member of the team will reply within 1–2 business days.`,
      bodyHtml: `
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL_BRAND.muted};font-weight:700;">Your message</p>
        <p style="margin:0;font-size:14px;line-height:1.65;color:${EMAIL_BRAND.slate};white-space:pre-wrap;">${escapeHtml(input.message)}</p>
      `,
    }),
    text: `Thanks ${input.name}, we received your ${input.subjectLabel} enquiry and will reply shortly.`,
  };
}

export function adminContactEmail(input: {
  name: string;
  email: string;
  subjectLabel: string;
  message: string;
}): { subject: string; html: string; text: string } {
  return {
    subject: `Contact form · ${input.subjectLabel} · ${input.name}`,
    html: wrapEmail({
      preheader: `${input.name} submitted a ${input.subjectLabel} enquiry.`,
      eyebrow: 'Website enquiry',
      title: 'New contact form message',
      intro: `<strong>${escapeHtml(input.name)}</strong> sent a message via the ${escapeHtml(SITE_NAME)} contact form.`,
      bodyHtml: `
        ${kvTable([
          ['Name', escapeHtml(input.name)],
          ['Email', escapeHtml(input.email)],
          ['Topic', escapeHtml(input.subjectLabel)],
        ])}
        <p style="margin:18px 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL_BRAND.muted};font-weight:700;">Message</p>
        <p style="margin:0;font-size:14px;line-height:1.65;color:${EMAIL_BRAND.slate};white-space:pre-wrap;">${escapeHtml(input.message)}</p>
      `,
    }),
    text: `Contact form from ${input.name} <${input.email}>\nTopic: ${input.subjectLabel}\n\n${input.message}`,
  };
}

export function adminGdprNoticeEmail(input: {
  title: string;
  details: string;
}): { subject: string; html: string; text: string } {
  return {
    subject: `GDPR notice · ${input.title}`,
    html: wrapEmail({
      preheader: input.details,
      eyebrow: 'Privacy operations',
      title: input.title,
      intro: 'A GDPR action was recorded on the storefront.',
      bodyHtml: `<p style="margin:0;font-size:14px;line-height:1.65;color:${EMAIL_BRAND.slate};">${escapeHtml(input.details)}</p>`,
    }),
    text: `${input.title}\n${input.details}`,
  };
}
