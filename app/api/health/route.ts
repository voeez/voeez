export const runtime = "edge";

export function GET() {
  return new Response(null, { status: 204 });
}

export function HEAD() {
  return new Response(null, { status: 204 });
}
