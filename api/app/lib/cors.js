const DEFAULT_ALLOWED_ORIGINS = [
  "https://tiktok.minchapseries.com",
  "https://dev.minchapseries.com",
  "http://localhost:3000",
  "http://localhost:3001",
];

function getAllowedOrigins() {
  const configuredOrigins = String(process.env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configuredOrigins.length > 0
    ? configuredOrigins
    : DEFAULT_ALLOWED_ORIGINS;
}

export function getCorsHeaders(request) {
  const origin = request?.headers?.get("origin") || "";
  const allowedOrigins = getAllowedOrigins();
  const allowOrigin = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Range, Authorization",
    "Access-Control-Expose-Headers":
      "Content-Length, Content-Range, Accept-Ranges, X-Subtitle-Converted, X-Subtitle-Cue-Count, X-Subtitle-First-Cue-Ms, X-Subtitle-Offset-Ms",
    Vary: "Origin",
  };
}

export function withCorsHeaders(request, headers = {}) {
  return {
    ...getCorsHeaders(request),
    ...headers,
  };
}

export function corsOptionsResponse(request) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}
