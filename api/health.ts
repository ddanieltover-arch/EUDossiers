export const config = {
  maxDuration: 10,
};

export default async function handler(_req: unknown, res: unknown) {
  const body = { ok: true, service: 'eudossier-api' };
  if (res && typeof (res as { status?: unknown }).status === 'function') {
    return (res as { status: (code: number) => { json: (value: unknown) => unknown } }).status(200).json(body);
  }
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
