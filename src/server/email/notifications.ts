import { Order } from '../../types';
import { insertContactMessage } from '../contact-repository';
import { getAdminNotifyEmail } from './config';
import { sendBrandedEmail } from './mailer';
import {
  CONTACT_SUBJECT_LABELS,
  adminContactEmail,
  adminGdprNoticeEmail,
  adminNewOrderEmail,
  adminOrderUpdateEmail,
  customerContactAckEmail,
  customerOrderConfirmationEmail,
  customerOrderUpdateEmail,
} from './templates';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export async function notifyOrderPlaced(order: Order): Promise<void> {
  const customer = customerOrderConfirmationEmail(order);
  const admin = adminNewOrderEmail(order);

  const [customerResult, adminResult] = await Promise.all([
    isValidEmail(order.customerEmail)
      ? sendBrandedEmail({
          to: order.customerEmail,
          subject: customer.subject,
          html: customer.html,
          text: customer.text,
        })
      : Promise.resolve({ ok: false as const, error: 'Invalid customer email' }),
    sendBrandedEmail({
      to: getAdminNotifyEmail(),
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
      replyTo: isValidEmail(order.customerEmail) ? order.customerEmail : undefined,
    }),
  ]);

  if (!customerResult.ok) {
    console.error('Customer order confirmation email failed:', customerResult.error);
  }
  if (!adminResult.ok) {
    console.error('Admin new-order email failed:', adminResult.error);
  }
}

export async function notifyOrderUpdated(
  order: Order,
  previousStatus?: Order['status']
): Promise<void> {
  const customer = customerOrderUpdateEmail(order, previousStatus);
  const admin = adminOrderUpdateEmail(order, previousStatus);

  const [customerResult, adminResult] = await Promise.all([
    isValidEmail(order.customerEmail)
      ? sendBrandedEmail({
          to: order.customerEmail,
          subject: customer.subject,
          html: customer.html,
          text: customer.text,
        })
      : Promise.resolve({ ok: false as const, error: 'Invalid customer email' }),
    sendBrandedEmail({
      to: getAdminNotifyEmail(),
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
      replyTo: isValidEmail(order.customerEmail) ? order.customerEmail : undefined,
    }),
  ]);

  if (!customerResult.ok) {
    console.error('Customer order update email failed:', customerResult.error);
  }
  if (!adminResult.ok) {
    console.error('Admin order update email failed:', adminResult.error);
  }
}

export async function notifyContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const subjectLabel = CONTACT_SUBJECT_LABELS[input.subject] || CONTACT_SUBJECT_LABELS.other;
  const customer = customerContactAckEmail({
    name: input.name,
    subjectLabel,
    message: input.message,
  });
  const admin = adminContactEmail({
    name: input.name,
    email: input.email,
    subjectLabel,
    message: input.message,
  });

  let saved = false;
  try {
    await insertContactMessage(input);
    saved = true;
  } catch (err) {
    console.error('Failed to persist contact message:', err);
  }

  const [customerResult, adminResult] = await Promise.all([
    sendBrandedEmail({
      to: input.email,
      subject: customer.subject,
      html: customer.html,
      text: customer.text,
    }),
    sendBrandedEmail({
      to: getAdminNotifyEmail(),
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
      replyTo: input.email,
    }),
  ]);

  if (!saved && !adminResult.ok) {
    throw new Error(adminResult.error || 'Failed to deliver the enquiry to our team');
  }
  if (!adminResult.ok) {
    console.warn('Contact admin email failed:', adminResult.error);
  }
  if (!customerResult.ok) {
    console.warn('Contact acknowledgement email failed:', customerResult.error);
  }
}

export async function notifyAdminGdpr(title: string, details: string): Promise<void> {
  const email = adminGdprNoticeEmail({ title, details });
  await sendBrandedEmail({
    to: getAdminNotifyEmail(),
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
}
