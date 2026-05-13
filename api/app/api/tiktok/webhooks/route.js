import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

function parseSignatureHeader(signatureHeader) {
  if (!signatureHeader) return null;

  const parts = Object.fromEntries(
    signatureHeader
      .split(",")
      .map((part) => part.trim().split("="))
      .filter(([key, value]) => key && value),
  );

  if (!parts.t || !parts.s) return null;

  return {
    timestamp: parts.t,
    signature: parts.s,
  };
}

function safeCompareHex(a, b) {
  const first = Buffer.from(a, "hex");
  const second = Buffer.from(b, "hex");

  if (first.length !== second.length) return false;

  return crypto.timingSafeEqual(first, second);
}

function verifyTikTokSignature({ bodyText, signatureHeader, clientSecret }) {
  if (!clientSecret) {
    return {
      ok: false,
      skipped: false,
      reason: "TIKTOK_CLIENT_SECRET is not configured",
    };
  }

  const parsedSignature = parseSignatureHeader(signatureHeader);

  if (!parsedSignature) {
    return { ok: false, reason: "Missing or invalid TikTok-Signature header" };
  }

  const timestamp = Number(parsedSignature.timestamp);

  if (!Number.isFinite(timestamp)) {
    return { ok: false, reason: "Invalid TikTok signature timestamp" };
  }

  const now = Math.floor(Date.now() / 1000);

  if (Math.abs(now - timestamp) > SIGNATURE_TOLERANCE_SECONDS) {
    return { ok: false, reason: "TikTok signature timestamp is too old" };
  }

  const signedPayload = `${parsedSignature.timestamp}.${bodyText}`;
  const expectedSignature = crypto
    .createHmac("sha256", clientSecret)
    .update(signedPayload)
    .digest("hex");

  if (!safeCompareHex(expectedSignature, parsedSignature.signature)) {
    return { ok: false, reason: "TikTok webhook signature mismatch" };
  }

  return { ok: true, skipped: false };
}

function parseWebhookContent(content) {
  if (!content) return {};

  if (typeof content === "object") return content;

  try {
    return JSON.parse(content);
  } catch {
    return {};
  }
}

async function handleTradeOrderRedeemSuccess(payload) {
  const content = parseWebhookContent(payload.content);

  // TODO: เมื่อ schema order พร้อมแล้ว ให้ใช้ content.order_id หรือ
  // content.trade_order_id ไป mark order เป็น paid แบบ idempotent
  // แล้วค่อย unlock VIP/episode/topup ในระบบของเรา
  console.info("TikTok payment success webhook received:", {
    event: payload.event,
    user_openid: payload.user_openid || "",
    trade_order_id: content.trade_order_id || "",
    order_id: content.order_id || "",
    is_sandbox: content.is_sandbox,
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "tiktok-webhooks",
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request) {
  const bodyText = await request.text();
  const signatureHeader =
    request.headers.get("tiktok-signature") ||
    request.headers.get("TikTok-Signature");

  const signatureCheck = verifyTikTokSignature({
    bodyText,
    signatureHeader,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
  });

  if (!signatureCheck.ok) {
    console.warn("Rejected TikTok webhook:", signatureCheck.reason);

    return NextResponse.json(
      { ok: false, error: "Invalid webhook signature" },
      { status: 401 },
    );
  }

  let payload;

  try {
    payload = bodyText ? JSON.parse(bodyText) : {};
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  try {
    switch (payload.event) {
      case "minis.trade_order.redeem.success":
        await handleTradeOrderRedeemSuccess(payload);
        break;
      default:
        console.info("TikTok webhook received:", {
          event: payload.event || "",
          user_openid: payload.user_openid || "",
          signatureSkipped: signatureCheck.skipped,
        });
    }
  } catch (error) {
    console.error("Failed to process TikTok webhook:", error);
  }

  return NextResponse.json({ ok: true });
}
