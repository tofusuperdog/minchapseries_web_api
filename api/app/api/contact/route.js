import { NextResponse } from "next/server";
import { corsOptionsResponse, withCorsHeaders } from "../../lib/cors";
import { createContactMessage } from "../../lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(request, data, init = {}) {
  return NextResponse.json(data, {
    ...init,
    headers: withCorsHeaders(request, {
      ...(init.headers || {}),
    }),
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json(request, { error: "Invalid JSON body" }, { status: 400 });
  }

  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const message = String(body?.message || "").trim();
  const locale = String(body?.locale || "").trim();
  const source = String(body?.source || "web").trim();
  const rawCustomerId = body?.customerId;
  const customerId =
    rawCustomerId === null || rawCustomerId === undefined || rawCustomerId === ""
      ? null
      : Number(rawCustomerId);

  if (!name || !email || !message) {
    return json(
      request,
      { error: "Name, email, and message are required" },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return json(request, { error: "Invalid email address" }, { status: 400 });
  }

  if (customerId !== null && !Number.isSafeInteger(customerId)) {
    return json(request, { error: "Invalid customer id" }, { status: 400 });
  }

  try {
    const contactMessage = await createContactMessage({
      customerId,
      name,
      email,
      message,
      locale,
      source,
    });

    return json(request, { ok: true, id: contactMessage?.id || null });
  } catch (error) {
    return json(
      request,
      {
        error: "Failed to save contact message",
        details: error?.message || String(error),
      },
      { status: 500 },
    );
  }
}

export function OPTIONS(request) {
  return corsOptionsResponse(request);
}
