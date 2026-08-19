import fs from 'fs';
import path from 'path';
import { CONTACT_EMAIL, SITE_NAME } from '../../brand';

export const EMAIL_BRAND = {
  ink: '#071421',
  navy: '#0b1f33',
  slate: '#2a4a66',
  muted: '#8fa8c0',
  paper: '#f5f7fa',
  border: '#dce3ec',
  white: '#ffffff',
  teal: '#14b8a6',
  tealDark: '#0f766e',
  tealSoft: '#ccfbf1',
} as const;

export function getAppUrl(): string {
  return (process.env.APP_URL || 'http://localhost:3001').replace(/\/$/, '');
}

export function getFromAddress(): string {
  return process.env.RESEND_FROM || `${SITE_NAME} <${CONTACT_EMAIL}>`;
}

export function getAdminNotifyEmail(): string {
  return (process.env.ADMIN_NOTIFY_EMAIL || CONTACT_EMAIL).trim();
}

export function getResendApiKey(): string | undefined {
  const key = process.env.RESEND_API_KEY?.trim();
  return key && !key.includes('xxxxxxxx') ? key : undefined;
}

export function resolveOgImagePath(): string | null {
  const candidates = [
    path.join(process.cwd(), 'og-image.png'),
    path.join(process.cwd(), 'public', 'og-image.png'),
    path.join(process.cwd(), 'dist', 'og-image.png'),
  ];
  return candidates.find((filePath) => fs.existsSync(filePath)) ?? null;
}

export function getLogoSrc(): { src: string; attachOgImage: boolean } {
  const filePath = resolveOgImagePath();
  if (filePath) {
    return { src: 'cid:eudossier-og', attachOgImage: true };
  }
  return { src: `${getAppUrl()}/og-image.png`, attachOgImage: false };
}
