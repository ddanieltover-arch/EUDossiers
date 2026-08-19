import fs from 'fs';
import { Resend } from 'resend';
import { getFromAddress, getLogoSrc, getResendApiKey, resolveOgImagePath } from './config';

let resendClient: Resend | null = null;

function getClient(): Resend | null {
  const apiKey = getResendApiKey();
  if (!apiKey) return null;
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

function ogAttachment() {
  const filePath = resolveOgImagePath();
  if (!filePath) return undefined;
  return [
    {
      filename: 'og-image.png',
      content: fs.readFileSync(filePath),
      contentId: 'eudossier-og',
    },
  ];
}

export async function sendBrandedEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const client = getClient();
  if (!client) {
    console.warn('Resend is not configured. Set RESEND_API_KEY to send transactional email.');
    return { ok: false, error: 'RESEND_API_KEY is not configured' };
  }

  const to = (Array.isArray(options.to) ? options.to : [options.to])
    .map((address) => address.trim())
    .filter(Boolean);

  if (to.length === 0) {
    return { ok: false, error: 'No recipient' };
  }

  try {
    const { error } = await client.emails.send({
      from: getFromAddress(),
      to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      attachments: getLogoSrc().attachOgImage ? ogAttachment() : undefined,
    });

    if (error) {
      console.error('Resend send failed:', error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('Resend send failed:', message);
    return { ok: false, error: message };
  }
}
