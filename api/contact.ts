import { parseContactPayload } from '../src/server/orders-service';
import { notifyContactMessage } from '../src/server/email/notifications';
import { ensureContactTable, listContactMessages } from '../src/server/contact-repository';
import { withApiHandler } from '../src/server/vercel-handler';

export const config = {
  maxDuration: 15,
};

export default async function handler(req: unknown, res: unknown) {
  return withApiHandler(req, res, async (method, body) => {
    if (method === 'GET') {
      await ensureContactTable();
      return { status: 200, body: await listContactMessages() };
    }

    if (method === 'POST') {
      const parsed = parseContactPayload(body);
      if ('error' in parsed) {
        return { status: 400, body: { error: parsed.error } };
      }
      await notifyContactMessage(parsed);
      return { status: 200, body: { success: true } };
    }

    return { status: 405, body: { error: 'Method not allowed' }, headers: { Allow: 'GET, POST' } };
  });
}
