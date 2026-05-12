"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "./lib/apiBaseUrl";

const waitForTikTokMinis = async () => {
  const maxAttempts = 20;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (typeof window !== "undefined" && window.TTMinis?.login) {
      return window.TTMinis;
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  return null;
};

const loginWithTikTokMinis = (ttMinis) =>
  new Promise((resolve, reject) => {
    let isSettled = false;
    let returnedSynchronously = false;
    const timeoutId = setTimeout(() => {
      finish(
        reject,
        new Error(
          `TikTok login timed out. loginReturned=${returnedSynchronously}. Check Basic information, Terms/Privacy URLs, testing permission, and whether this QR was opened inside TikTok.`,
        ),
      );
    }, 15000);

    function finish(handler, value) {
      if (isSettled) return;
      isSettled = true;
      clearTimeout(timeoutId);
      handler(value);
    }

    try {
      const result = ttMinis.login(
        (response) => {
          const code = getAuthorizationCode(response);

          if (code) {
            finish(resolve, response);
            return;
          }

          finish(
            reject,
            new Error(
              `TikTok login did not return an authorization code: ${formatError(response)}`,
            ),
          );
        },
        {
          returnScopes: true,
        },
      );

      returnedSynchronously = true;

      if (result?.then) {
        result
          .then((response) => finish(resolve, response))
          .catch((error) => finish(reject, error));
      } else if (getAuthorizationCode(result)) {
        finish(resolve, result);
      }
    } catch (error) {
      finish(reject, error);
    }
  });

const getAuthorizationCode = (loginResult) =>
  loginResult?.code ||
  loginResult?.authorizationCode ||
  loginResult?.AuthorizationCode ||
  loginResult?.authCode ||
  loginResult?.authResponse?.code ||
  loginResult?.authResponse?.authorizationCode ||
  loginResult?.data?.authResponse?.code ||
  loginResult?.data?.code ||
  "";

const formatError = (error) => {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  return error.message || error.errMsg || JSON.stringify(error);
};

export default function TikTokSilentLoginPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState({
    status: "checking",
    title: "Checking TikTok",
    message: "กำลังตรวจสอบ TikTok Mini environment",
    details: "",
    user: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function runSilentLogin() {
      setIsOpen(true);

      const ttMinis = await waitForTikTokMinis();

      if (!isMounted) return;

      if (!ttMinis) {
        setState({
          status: "not_tiktok",
          title: "ไม่ได้มาจาก TikTok",
          message: "หน้านี้ไม่ได้ถูกเปิดจาก TikTok Mini environment จึงไม่สามารถเรียก Silent Login ได้",
          details: "window.TTMinis.login was not found after waiting for the SDK.",
          user: null,
        });
        return;
      }

      if (!window.__MINCHAP_TIKTOK_CLIENT_KEY__) {
        setState({
          status: "error",
          title: "TikTok Client Key ยังไม่ได้ตั้งค่า",
          message: "กรุณาตั้งค่า NEXT_PUBLIC_TIKTOK_CLIENT_KEY หรือ TIKTOK_CLIENT_KEY ก่อนทดสอบ Silent Login",
          details: "window.__MINCHAP_TIKTOK_CLIENT_KEY__ is empty.",
          user: null,
        });
        return;
      }

      try {
        if (!window.__MINCHAP_TIKTOK_SDK_READY__ && ttMinis.init) {
          ttMinis.init({ clientKey: window.__MINCHAP_TIKTOK_CLIENT_KEY__ });
          window.__MINCHAP_TIKTOK_SDK_READY__ = true;
        }

        setState({
          status: "logging_in",
          title: "TikTok Silent Login-test#1",
          message: "กำลังขอ authorization code จาก TikTok",
          details: `SDK ready=${Boolean(window.__MINCHAP_TIKTOK_SDK_READY__)}, login type=${typeof ttMinis.login}`,
          user: null,
        });

        const loginResult = await loginWithTikTokMinis(ttMinis);
        const code = getAuthorizationCode(loginResult);

        if (!code) {
          throw new Error("TikTok login did not return an authorization code");
        }

        setState({
          status: "exchanging",
          title: "TikTok Silent Login-test#1",
          message: "ได้รับ code แล้ว กำลังส่งไป backend เพื่อแลก open_id",
          details: "Authorization code received from TTMinis.login callback.",
          user: null,
        });

        const response = await fetch(getApiUrl("/api/tiktok/silent-login"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.error || `Backend login failed: ${response.status}`);
        }

        if (!isMounted) return;

        setState({
          status: "success",
          title: "TikTok User Info",
          message: "Silent Login สำเร็จ",
          details: "Backend token exchange completed.",
          user: payload.user,
        });
      } catch (error) {
        if (!isMounted) return;

        setState({
          status: "error",
          title: "TikTok Silent Login Failed",
          message: formatError(error),
          details: `TTMinis exists=${Boolean(window.TTMinis)}, login type=${typeof window.TTMinis?.login}, SDK ready=${Boolean(window.__MINCHAP_TIKTOK_SDK_READY__)}`,
          user: null,
        });
      }
    }

    runSilentLogin();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 text-slate-950 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{state.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{state.message}</p>
            {state.details ? (
              <p className="mt-2 break-words text-xs text-slate-500">{state.details}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
            aria-label="Close TikTok login popup"
          >
            x
          </button>
        </div>

        {state.user ? (
          <div className="space-y-2 rounded-md bg-slate-50 p-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Open ID</span>
              <span className="break-all text-right font-medium">{state.user.open_id}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Token Type</span>
              <span className="font-medium">{state.user.token_type || "-"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Scope</span>
              <span className="break-all text-right font-medium">{state.user.scope || "-"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Expires In</span>
              <span className="font-medium">{state.user.expires_in || "-"}s</span>
            </div>
          </div>
        ) : null}

        {["checking", "logging_in", "exchanging"].includes(state.status) ? (
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[#fe2c55]" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
