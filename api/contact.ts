function reply(res: unknown, status: number, body: unknown) {
  if (res && typeof (res as { status?: unknown }).status === 'function') {
    return (res as { status: (code: number) => { json: (value: unknown) => unknown } }).status(status).json(body);
  }
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req: unknown, res: unknown) {
  try {
    const { withApiHandler } = await import('../src/server/vercel-handler');
    const { parseContactPayload } = await import('../src/server/orders-service');
    const { notifyContactMessage } = await import('../src/server/email/notifications');
    const { ensureContactTable, listContactMessages } = await import('../src/server/contact-repository');
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
  } catch (err) {
    console.error('Contact API load error:', err);
    return reply(res, 500, { error: err instanceof Error ? err.message : String(err) });
  }
}

export const config = { maxDuration: 15 };
