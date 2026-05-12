"use client";

import { useLanguage } from "../LanguageContext";
import { useState } from "react";

export default function AppMySeries() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("recent"); // recent or favorite

  const tabs = [
    { id: "recent", label: t("recent_series") },
    { id: "favorite", label: t("favorite_series") },
  ];

  return (
    <div className="flex flex-col w-full h-[calc(100vh-130px)] bg-black text-white">
      
      {/* Tabs Header */}
      <div className="flex w-full border-b border-white/5 px-4 pt-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-sm font-medium transition-all relative ${
              activeTab === tab.id ? "text-white" : "text-white/40"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-[#BF8EFF] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-white/20"
          >
            {activeTab === "recent" ? (
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            )}
          </svg>
        </div>
        <h3 className="text-[17px] font-bold text-white/90 mb-1">
          {activeTab === "recent" ? t("recent_series") : t("favorite_series")}
        </h3>
        <p className="text-sm text-white/40 max-w-[200px] leading-relaxed">
          {t("no_data")}
        </p>
      </div>

    </div>
  );
}
