import { parseContactPayload } from '../server/orders-service';
import { notifyContactMessage } from '../server/email/notifications';
import { ensureContactTable, listContactMessages, updateContactMessageStatus, deleteContactMessageById } from '../server/contact-repository';
import { parseJsonBody, withApiHandler } from '../server/http';

export const config = { maxDuration: 15 };

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
    if (method === 'PATCH') {
      const payload = parseJsonBody(body) as { id?: string; status?: any };
      if (!payload.id || !payload.status) {
        return { status: 400, body: { error: 'Message ID and status are required' } };
      }
      const updated = await updateContactMessageStatus(payload.id, payload.status);
      if (!updated) {
        return { status: 404, body: { error: 'Message not found' } };
      }
      return { status: 200, body: updated };
    }
    if (method === 'DELETE') {
      const payload = parseJsonBody(body) as { id?: string };
      if (!payload.id) {
        return { status: 400, body: { error: 'Message ID is required' } };
      }
      const deleted = await deleteContactMessageById(payload.id);
      return { status: 200, body: { success: deleted, id: payload.id } };
    }
    return { status: 405, body: { error: 'Method not allowed' }, headers: { Allow: 'GET, POST, PATCH, DELETE' } };
  });
}
