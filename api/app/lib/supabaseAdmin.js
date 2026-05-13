const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getSupabaseRestUrl(path) {
  return `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${path}`;
}

export async function upsertTikTokCustomer(openId) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  const response = await fetch(
    getSupabaseRestUrl(
      "customers?on_conflict=tiktok_open_id&select=id,tiktok_open_id,preferred_language",
    ),
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify({
        tiktok_open_id: openId,
        last_login_at: new Date().toISOString(),
      }),
      cache: "no-store",
    },
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message ||
        payload?.error ||
        "Failed to upsert Supabase customer",
    );
  }

  return Array.isArray(payload) ? payload[0] || null : payload;
}

export async function updateTikTokCustomerLanguage({ customerId, openId, language }) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase admin credentials are not configured");
  }

  const response = await fetch(
    getSupabaseRestUrl(
      `customers?id=eq.${encodeURIComponent(customerId)}&tiktok_open_id=eq.${encodeURIComponent(openId)}&select=id,tiktok_open_id,preferred_language`,
    ),
    {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        preferred_language: language,
        updated_at: new Date().toISOString(),
      }),
      cache: "no-store",
    },
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message ||
        payload?.error ||
        "Failed to update Supabase customer language",
    );
  }

  return Array.isArray(payload) ? payload[0] || null : payload;
}

export async function getTikTokCustomerById({ customerId, openId }) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase admin credentials are not configured");
  }

  const response = await fetch(
    getSupabaseRestUrl(
      `customers?id=eq.${encodeURIComponent(customerId)}&tiktok_open_id=eq.${encodeURIComponent(openId)}&select=id,tiktok_open_id,preferred_language&limit=1`,
    ),
    {
      method: "GET",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      cache: "no-store",
    },
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message ||
        payload?.error ||
        "Failed to fetch Supabase customer",
    );
  }

  return Array.isArray(payload) ? payload[0] || null : payload;
}

export async function createContactMessage({
  customerId,
  name,
  email,
  message,
  locale,
  source,
}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase admin credentials are not configured");
  }

  const response = await fetch(
    getSupabaseRestUrl("contact_messages?select=id"),
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        customer_id: customerId || null,
        name,
        email,
        message,
        locale: locale || null,
        source: source || "web",
      }),
      cache: "no-store",
    },
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message ||
        payload?.error ||
        "Failed to create contact message",
    );
  }

  return Array.isArray(payload) ? payload[0] || null : payload;
}
