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

export async function upsertCustomerRecentSeries({
  customerId,
  seriesId,
  watchedAt,
}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase admin credentials are not configured");
  }

  const response = await fetch(
    getSupabaseRestUrl(
      "customer_recent_series?on_conflict=customer_id,series_id&select=id,customer_id,series_id,watched_at",
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
        customer_id: customerId,
        series_id: seriesId,
        watched_at: watchedAt || new Date().toISOString(),
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
        "Failed to upsert customer recent series",
    );
  }

  return Array.isArray(payload) ? payload[0] || null : payload;
}

export async function getCustomerRecentSeries({ customerId }) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase admin credentials are not configured");
  }

  const response = await fetch(
    getSupabaseRestUrl(
      `customer_recent_series?customer_id=eq.${encodeURIComponent(customerId)}&select=series_id,watched_at,series(id,title_th,title_en,title_jp,title_cn,poster_url)&order=watched_at.desc&limit=9`,
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
        "Failed to fetch customer recent series",
    );
  }

  return Array.isArray(payload)
    ? payload
        .map((item) =>
          item.series
            ? {
                ...item.series,
                watched_at: item.watched_at,
              }
            : null,
        )
        .filter(Boolean)
    : [];
}

export async function upsertCustomerFavoriteSeries({
  customerId,
  seriesId,
  favoritedAt,
}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase admin credentials are not configured");
  }

  const response = await fetch(
    getSupabaseRestUrl(
      "customer_favorite_series?on_conflict=customer_id,series_id&select=id,customer_id,series_id,favorited_at",
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
        customer_id: customerId,
        series_id: seriesId,
        favorited_at: favoritedAt || new Date().toISOString(),
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
        "Failed to upsert customer favorite series",
    );
  }

  return Array.isArray(payload) ? payload[0] || null : payload;
}

export async function deleteCustomerFavoriteSeries({ customerId, seriesId }) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase admin credentials are not configured");
  }

  const response = await fetch(
    getSupabaseRestUrl(
      `customer_favorite_series?customer_id=eq.${encodeURIComponent(customerId)}&series_id=eq.${encodeURIComponent(seriesId)}`,
    ),
    {
      method: "DELETE",
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
        "Failed to delete customer favorite series",
    );
  }

  return true;
}

export async function isCustomerFavoriteSeries({ customerId, seriesId }) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase admin credentials are not configured");
  }

  const response = await fetch(
    getSupabaseRestUrl(
      `customer_favorite_series?customer_id=eq.${encodeURIComponent(customerId)}&series_id=eq.${encodeURIComponent(seriesId)}&select=id&limit=1`,
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
        "Failed to fetch customer favorite series status",
    );
  }

  return Array.isArray(payload) && payload.length > 0;
}

export async function getCustomerFavoriteSeries({ customerId }) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase admin credentials are not configured");
  }

  const response = await fetch(
    getSupabaseRestUrl(
      `customer_favorite_series?customer_id=eq.${encodeURIComponent(customerId)}&select=series_id,favorited_at,series(id,title_th,title_en,title_jp,title_cn,poster_url)&order=favorited_at.desc&limit=9`,
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
        "Failed to fetch customer favorite series",
    );
  }

  return Array.isArray(payload)
    ? payload
        .map((item) =>
          item.series
            ? {
                ...item.series,
                favorited_at: item.favorited_at,
              }
            : null,
        )
        .filter(Boolean)
    : [];
}
