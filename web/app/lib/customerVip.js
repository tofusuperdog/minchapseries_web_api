"use client";

import { getApiUrl } from "./apiBaseUrl";

const TIKTOK_USER_STORAGE_KEY = "minchap_tiktok_user";
export const CUSTOMER_VIP_UPDATED_EVENT = "minchap_customer_vip_updated";

export function getStoredCustomer() {
  if (typeof window === "undefined") return null;

  try {
    const user = JSON.parse(
      window.localStorage.getItem(TIKTOK_USER_STORAGE_KEY) || "null",
    );

    if (
      !user?.id ||
      !user?.open_id ||
      !user?.customer_auth_token ||
      user?.is_dev_bypass
    ) {
      return null;
    }

    return {
      customerId: user.id,
      openId: user.open_id,
      customerAuthToken: user.customer_auth_token,
      tiktokAccessToken: user.access_token || "",
    };
  } catch {
    return null;
  }
}

export function isVipSubscriptionActive(subscription) {
  return Boolean(
    subscription?.is_active &&
      subscription?.expires_at &&
      new Date(subscription.expires_at).getTime() > Date.now(),
  );
}

export async function loadCustomerVipSubscription({ includeHistory = false } = {}) {
  const customer = getStoredCustomer();
  if (!customer) {
    return { is_active: false, subscription: null };
  }

  const params = new URLSearchParams({
    customerId: String(customer.customerId),
    openId: customer.openId,
  });
  if (includeHistory) {
    params.set("includeHistory", "1");
  }
  const response = await fetch(
    getApiUrl(`/api/customer/vip-subscription?${params.toString()}`),
    {
      headers: {
        "x-customer-auth-token": customer.customerAuthToken,
      },
    },
  );
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Unable to load VIP subscription.");
  }

  return payload;
}

export async function activateVipPackageForTest(packageId) {
  const customer = getStoredCustomer();
  if (!customer) {
    throw new Error("Please sign in before subscribing VIP.");
  }

  const response = await fetch(getApiUrl("/api/customer/vip-subscription"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-customer-auth-token": customer.customerAuthToken,
    },
    body: JSON.stringify({
      customerId: customer.customerId,
      openId: customer.openId,
      packageId,
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Unable to activate VIP subscription.");
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(CUSTOMER_VIP_UPDATED_EVENT, { detail: payload }),
    );
  }

  return payload;
}

export async function createTikTokVipPaymentOrder(packageId) {
  const customer = getStoredCustomer();
  if (!customer) {
    throw new Error("Please sign in before subscribing VIP.");
  }

  if (!customer.tiktokAccessToken) {
    throw new Error("Please sign in again before paying with TikTok.");
  }

  const response = await fetch(getApiUrl("/api/tiktok-minis/payment-order"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-customer-auth-token": customer.customerAuthToken,
    },
    body: JSON.stringify({
      customerId: customer.customerId,
      openId: customer.openId,
      packageId,
      tiktokAccessToken: customer.tiktokAccessToken,
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Unable to create TikTok payment order.");
  }

  return payload;
}

export async function waitForActiveVipSubscription({
  attempts = 20,
  delayMs = 1500,
} = {}) {
  let lastPayload = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    lastPayload = await loadCustomerVipSubscription();

    if (isVipSubscriptionActive(lastPayload.subscription)) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(CUSTOMER_VIP_UPDATED_EVENT, { detail: lastPayload }),
        );
      }

      return lastPayload;
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return lastPayload || { is_active: false, subscription: null };
}
