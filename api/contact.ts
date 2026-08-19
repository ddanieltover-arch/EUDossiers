import { parseContactPayload } from '../src/server/orders-service';
import { notifyContactMessage } from '../src/server/email/notifications';
import { parseJsonBody } from '../src/server/parse-json-body';

export const config = {
  maxDuration: 15,
};

function errorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  return 'Failed to send your message';
}

export default async function handler(
  req: { method?: string; body?: unknown },
  res: {
    status: (code: number) => { json: (body: unknown) => unknown };
    setHeader: (name: string, value: string) => void;
  }
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsed = parseContactPayload(parseJsonBody(req.body));
  if ('error' in parsed) {
    return res.status(400).json({ error: parsed.error });
  }

  try {
    await notifyContactMessage(parsed);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(500).json({ error: errorMessage(err) });
  }
}
