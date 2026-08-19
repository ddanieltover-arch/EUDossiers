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
    const maybeBuffer = body as { type?: string; data?: number[]; toString?: (enc?: string) => string };
    if (typeof maybeBuffer.toString === 'function' && maybeBuffer.type === 'Buffer' && Array.isArray(maybeBuffer.data)) {
      try {
        const parsed = JSON.parse(maybeBuffer.toString('utf8'));
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
      } catch {
        return {};
      }
    }
    return body as Record<string, unknown>;
  }

  return {};
}
