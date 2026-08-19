export function parseJsonBody(body: unknown): Record<string, unknown> {
  if (body == null) return {};

  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(body)) {
    try {
      const parsed = JSON.parse(body.toString('utf8'));
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

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
