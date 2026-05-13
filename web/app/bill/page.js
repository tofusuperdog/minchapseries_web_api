"use client";

import { useLanguage } from "../LanguageContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const billContent = {
  TH: {
    title: "ประวัติการสมัคร",
    subtitle: "ดูรายการแพ็กเกจที่เคยสมัคร",
    usagePeriod: "เวลาใช้งาน",
    orderNumber: "คำสั่งซื้อ",
    items: [
      {
        id: "MC24091530",
        plan: "VIP 30 วัน",
        price: "359 บาท",
        startDate: "15 ก.ย. 2026",
        endDate: "15 ต.ค. 2026",
        icon: "crown",
      },
      {
        id: "MC24090107",
        plan: "VIP 7 วัน",
        price: "129 บาท",
        startDate: "01 ก.ย. 2026",
        endDate: "08 ก.ย. 2026",
        icon: "calendar",
      },
      {
        id: "MC24080130",
        plan: "VIP 30 วัน",
        price: "359 บาท",
        startDate: "01 ส.ค. 2026",
        endDate: "31 ส.ค. 2026",
        icon: "crown",
      },
    ],
  },
  EN: {
    title: "Subscription History",
    subtitle: "View packages you have subscribed to",
    usagePeriod: "Active period",
    orderNumber: "Order",
    items: [
      {
        id: "MC24091530",
        plan: "VIP 30 Days",
        price: "359 THB",
        startDate: "Sep 15, 2026",
        endDate: "Oct 15, 2026",
        icon: "crown",
      },
      {
        id: "MC24090107",
        plan: "VIP 7 Days",
        price: "129 THB",
        startDate: "Sep 01, 2026",
        endDate: "Sep 08, 2026",
        icon: "calendar",
      },
      {
        id: "MC24080130",
        plan: "VIP 30 Days",
        price: "359 THB",
        startDate: "Aug 01, 2026",
        endDate: "Aug 31, 2026",
        icon: "crown",
      },
    ],
  },
  JP: {
    title: "購読履歴",
    subtitle: "これまで購読したパッケージを確認",
    usagePeriod: "利用期間",
    orderNumber: "注文番号",
    items: [
      {
        id: "MC24091530",
        plan: "VIP 30日",
        price: "359 THB",
        startDate: "2026年9月15日",
        endDate: "2026年10月15日",
        icon: "crown",
      },
      {
        id: "MC24090107",
        plan: "VIP 7日",
        price: "129 THB",
        startDate: "2026年9月1日",
        endDate: "2026年9月8日",
        icon: "calendar",
      },
      {
        id: "MC24080130",
        plan: "VIP 30日",
        price: "359 THB",
        startDate: "2026年8月1日",
        endDate: "2026年8月31日",
        icon: "crown",
      },
    ],
  },
  CN: {
    title: "订阅历史",
    subtitle: "查看曾经订阅的套餐",
    usagePeriod: "使用时间",
    orderNumber: "订单号",
    items: [
      {
        id: "MC24091530",
        plan: "VIP 30 天",
        price: "359 THB",
        startDate: "2026年9月15日",
        endDate: "2026年10月15日",
        icon: "crown",
      },
      {
        id: "MC24090107",
        plan: "VIP 7 天",
        price: "129 THB",
        startDate: "2026年9月1日",
        endDate: "2026年9月8日",
        icon: "calendar",
      },
      {
        id: "MC24080130",
        plan: "VIP 30 天",
        price: "359 THB",
        startDate: "2026年8月1日",
        endDate: "2026年8月31日",
        icon: "crown",
      },
    ],
  },
};

function PlanIcon({ type }) {
  if (type === "calendar") {
    return (
      <svg
        className="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </svg>
    );
  }

  return (
    <svg
      className="w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m2 7 4.5 4.5L12 4l5.5 7.5L22 7l-2 13H4L2 7Z" />
      <path d="M8 14h8" />
    </svg>
  );
}

function SubscriptionCard({ item, labels }) {
  return (
    <article className="flex min-h-[76px] w-full items-center gap-3 rounded-[12px] border border-white/10 bg-[linear-gradient(135deg,rgba(31,32,35,0.94),rgba(13,14,16,0.98))] px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#A34CFF]/16 text-[#BF6CFF]">
        <PlanIcon type={item.icon} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <h2 className="truncate text-[16px] font-extrabold leading-tight text-white">
            {item.plan}
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[14px] font-extrabold leading-none text-white">
              {item.price}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-[12.5px] font-normal leading-tight text-[#8F8B96]">
          <div className="flex min-w-0 items-center gap-1.5">
            <svg
              className="h-3.5 w-3.5 shrink-0 text-[#8F8B96]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4" />
              <path d="M8 2v4" />
              <path d="M3 10h18" />
            </svg>
            <span className="truncate">
              {labels.usagePeriod} {item.startDate} - {item.endDate}
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-1.5">
            <svg
              className="h-3.5 w-3.5 shrink-0 text-[#8F8B96]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 2h12l4 4v16H4z" />
              <path d="M14 2v6h6" />
              <path d="M8 13h8" />
              <path d="M8 17h5" />
            </svg>
            <span className="truncate">
              {labels.orderNumber}:{" "}
              <span className="text-[#A879D8]">#{item.id}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function BillPage() {
  const { language, changeLanguage } = useLanguage();
  const router = useRouter();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const languages = ["TH", "EN", "JP", "CN"];
  const content = billContent[language] || billContent.TH;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex h-[calc(100dvh-70px)] w-full flex-col overflow-y-auto bg-black text-white no-scrollbar">
      <header className="hidden">
        <button onClick={() => router.back()} className="p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className="flex items-center">
          <img
            src="/minchap.svg"
            alt="MinChap"
            className="object-contain w-auto h-6"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 rounded border border-white/10 bg-[#1A1A1A] px-2 py-1 text-xs font-semibold uppercase text-white/90"
            >
              {language}
              <svg
                className={`h-3 w-3 transition-transform ${isLangOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 z-50 mt-2 flex w-20 flex-col rounded-lg border border-white/10 bg-[#1A1A1A] py-1 shadow-lg">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      changeLanguage(lang);
                      setIsLangOpen(false);
                    }}
                    className={`px-4 py-2 text-left text-sm transition-colors hover:bg-white/10 ${language === lang ? "font-bold text-white" : "text-white/60"}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex items-center justify-center w-8 h-8 rounded text-white/90 opacity-60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>

          <button onClick={() => router.push("/")} className="p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      <main className="relative min-h-[calc(100dvh-130px)] overflow-hidden pb-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_12%,rgba(118,25,185,0.34),transparent_42%),radial-gradient(circle_at_76%_58%,rgba(71,18,112,0.22),transparent_48%),linear-gradient(180deg,#000_0%,#12031E_48%,#060109_100%)]" />

        <section className="relative z-10 flex min-h-[96px] w-full items-center px-5">
          <div className="flex items-center w-full gap-4">
            <img
              src="/popcorn.svg"
              alt="Popcorn"
              className="h-[68px] w-[68px] shrink-0 object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.55)]"
            />

            <div className="flex flex-col min-w-0 gap-1">
              <h1 className="text-[25px] font-extrabold leading-tight text-white">
                {content.title}
              </h1>
              <p className="text-[15px] font-medium leading-tight text-white/58">
                {content.subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="relative z-10 px-2 pt-3">
          <div className="flex flex-col gap-2.5">
            {content.items.map((item) => (
              <SubscriptionCard key={item.id} item={item} labels={content} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
