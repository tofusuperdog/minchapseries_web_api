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

export async function loadCustomerVipSubscription() {
  const customer = getStoredCustomer();
  if (!customer) {
    return { is_active: false, subscription: null };
  }

  const params = new URLSearchParams({
    customerId: String(customer.customerId),
    openId: customer.openId,
  });
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
