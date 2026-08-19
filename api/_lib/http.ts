export function parseJsonBody(body: unknown): Record<string, unknown> {
  if (body == null) return {};

  if (typeof body === 'string') {
    const trimmed = body.trim();
    if (!trimmed) return {};
    try {
      const parsed = JSON.parse(trimmed);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  if (typeof body === 'object' && !Array.isArray(body)) {
    return body as Record<string, unknown>;
  }

  return {};
}

export type ApiResult = {
  status: number;
  body: unknown;
  headers?: Record<string, string>;
};

function isNodeResponse(res: unknown): res is {
  status: (code: number) => { json: (body: unknown) => unknown };
  setHeader?: (name: string, value: string) => void;
} {
  return typeof (res as { status?: unknown })?.status === 'function';
}

export async function readJsonBody(req: unknown, fallbackBody?: unknown): Promise<unknown> {
  if (typeof Request !== 'undefined' && req instanceof Request) {
    try {
      return await req.clone().json();
    } catch {
      return {};
    }
  }
  return parseJsonBody(fallbackBody);
}

export function readPathId(req: unknown, prefix: string): string {
  const nodeQuery = (req as { query?: Record<string, unknown> })?.query;
  const queryId = nodeQuery?.id;
  if (typeof queryId === 'string' && queryId) return queryId;
  if (Array.isArray(queryId) && queryId[0]) return String(queryId[0]);

  try {
    const rawUrl = (req as { url?: string })?.url || '';
    const url = new URL(rawUrl, 'http://localhost');
    const parts = url.pathname.split('/').filter(Boolean);
    const prefixParts = prefix.split('/').filter(Boolean);
    if (parts.length > prefixParts.length) {
      return decodeURIComponent(parts[prefixParts.length] || '');
    }
  } catch {
    /* ignore */
  }
  return '';
}

export function sendApiResult(res: unknown, result: ApiResult): unknown {
  if (isNodeResponse(res)) {
    if (result.headers) {
      for (const [name, value] of Object.entries(result.headers)) {
        res.setHeader?.(name, value);
      }
    }
    return res.status(result.status).json(result.body);
  }

  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: {
      'Content-Type': 'application/json',
      ...result.headers,
    },
  });
}

export async function withApiHandler(
  req: unknown,
  res: unknown,
  fn: (method: string, body: unknown, req: unknown) => Promise<ApiResult>
): Promise<unknown> {
  try {
    const method = String((req as { method?: string })?.method || 'GET').toUpperCase();
    const body =
      method === 'GET' || method === 'HEAD' || method === 'OPTIONS'
        ? {}
        : await readJsonBody(req, (req as { body?: unknown })?.body);
    const result = await fn(method, body, req);
    return sendApiResult(res, result);
  } catch (err) {
    console.error('API handler error:', err);
    const message = err instanceof Error ? err.message : 'Server error';
    return sendApiResult(res, { status: 500, body: { error: message } });
  }
}
