"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../LanguageContext";

const faqContent = {
  TH: {
    title: "คำถามที่พบบ่อย",
    items: [
      {
        question: "VIP ใช้ดูอะไรได้บ้าง?",
        answer: "VIP ใช้สำหรับดูซีรีส์ได้ไม่จำกัดตามแพ็กเกจที่สมัคร",
      },
      {
        question: "ดูประวัติการสมัครได้ที่ไหน?",
        answer: "สามารถดูได้จากเมนูประวัติการสมัครในหน้าโปรไฟล์",
      },
      {
        question: "ต้องการความช่วยเหลือติดต่อที่ไหน?",
        answer: "สามารถติดต่อทีมงานผ่านเมนูติดต่อเราในหน้าโปรไฟล์",
      },
      {
        question: "สมัคร VIP ได้ที่ไหน?",
        answer: "สามารถสมัคร VIP ได้จากเมนู VIP หรือหน้าโปรไฟล์ แล้วเลือกแพ็กเกจที่ต้องการ",
      },
      {
        question: "เปลี่ยนภาษาแอปได้อย่างไร?",
        answer: "กดปุ่มภาษา เช่น TH, EN, JP, CN ที่แถบด้านบนของหน้า แล้วเลือกภาษาที่ต้องการ",
      },
    ],
  },
  EN: {
    title: "FAQ",
    items: [
      {
        question: "What can I watch with VIP?",
        answer: "VIP lets you watch series without limits based on your plan.",
      },
      {
        question: "Where can I view subscription history?",
        answer: "Use the Subscription History menu on the profile page.",
      },
      {
        question: "Where can I get help?",
        answer: "Contact support from the Contact Us menu on the profile page.",
      },
      {
        question: "Where can I subscribe to VIP?",
        answer: "You can subscribe from the VIP menu or profile page, then choose the plan you want.",
      },
      {
        question: "How do I change the app language?",
        answer: "Tap the language button, such as TH, EN, JP, or CN, at the top of the page and choose your preferred language.",
      },
    ],
  },
  JP: {
    title: "よくある質問",
    items: [
      {
        question: "VIPでは何を視聴できますか?",
        answer: "VIPでは、プランに応じてシリーズを制限なく視聴できます。",
      },
      {
        question: "購読履歴はどこで確認できますか?",
        answer: "プロフィールページの購読履歴メニューから確認できます。",
      },
      {
        question: "サポートへの連絡方法は?",
        answer: "プロフィールページのお問い合わせメニューから連絡できます。",
      },
      {
        question: "VIPにはどこから登録できますか?",
        answer: "VIPメニューまたはプロフィールページから登録し、希望するプランを選択できます。",
      },
      {
        question: "アプリの言語はどう変更できますか?",
        answer: "ページ上部のTH、EN、JP、CNなどの言語ボタンを押して、希望する言語を選択してください。",
      },
    ],
  },
  CN: {
    title: "常见问题",
    items: [
      {
        question: "VIP 可以观看什么内容?",
        answer: "VIP 可根据订阅套餐无限观看剧集。",
      },
      {
        question: "在哪里查看订阅历史?",
        answer: "可在个人资料页面的订阅历史菜单中查看。",
      },
      {
        question: "在哪里获得帮助?",
        answer: "可通过个人资料页面的联系我们菜单联系支持团队。",
      },
      {
        question: "在哪里订阅 VIP?",
        answer: "您可以从 VIP 菜单或个人资料页面订阅，然后选择需要的套餐。",
      },
      {
        question: "如何更改应用语言?",
        answer: "点击页面顶部的语言按钮，例如 TH、EN、JP 或 CN，然后选择您想使用的语言。",
      },
    ],
  },
};

const faqDescription = {
  TH: "รวมคำตอบสำหรับคำถามที่ผู้ใช้ถามบ่อย\nเพื่อช่วยให้คุณใช้งาน MinChap ได้ง่ายขึ้น",
  EN: "Answers to common questions from users\nso you can use MinChap more easily",
  JP: "ユーザーからよく寄せられる質問への回答をまとめました\nMinChapをより簡単にご利用いただくためのヘルプです",
  CN: "整理用户常见问题的答案\n帮助您更轻松地使用 MinChap",
};

const faqIcons = [
  {
    className: "bg-[#6D36D8] shadow-[0_0_14px_rgba(109,54,216,0.45)]",
    paths: [
      <path key="screen" d="M4 6h16v10H4z" />,
      <path key="play" d="m10 9 4 2-4 2V9z" />,
      <path key="base" d="M8 20h8" />,
      <path key="stand" d="M12 16v4" />,
    ],
  },
  {
    className: "bg-[#6D36D8] shadow-[0_0_14px_rgba(109,54,216,0.45)]",
    paths: [
      <path key="clock" d="M12 8v5l3 2" />,
      <path key="circle" d="M21 12a9 9 0 1 1-3.3-7" />,
      <path key="arrow" d="M21 4v5h-5" />,
    ],
  },
  {
    className: "bg-[#6D36D8] shadow-[0_0_14px_rgba(109,54,216,0.45)]",
    paths: [
      <path key="bubble" d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />,
      <path key="dot1" d="M8 10h.01" />,
      <path key="dot2" d="M12 10h.01" />,
      <path key="dot3" d="M16 10h.01" />,
    ],
  },
  {
    className: "bg-[#6D36D8] shadow-[0_0_14px_rgba(109,54,216,0.45)]",
    paths: [
      <path key="crown" d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />,
      <path key="base" d="M5 20h14" />,
    ],
  },
  {
    className: "bg-[#6D36D8] shadow-[0_0_14px_rgba(109,54,216,0.45)]",
    paths: [
      <circle key="circle" cx="12" cy="12" r="9" />,
      <path key="horizontal" d="M3 12h18" />,
      <path key="east" d="M12 3a14 14 0 0 1 0 18" />,
      <path key="west" d="M12 3a14 14 0 0 0 0 18" />,
    ],
  },
];

const faqItemOrder = [3, 0, 1, 4, 2];

const faqContactCta = {
  TH: {
    title: "ยังไม่เจอคำตอบที่ต้องการ?",
    subtitle: "ติดต่อทีมสนับสนุนของเราได้ทุกเมื่อ",
    action: "ติดต่อเรา",
  },
  EN: {
    title: "Still cannot find the answer?",
    subtitle: "Contact our support team anytime",
    action: "Contact",
  },
  JP: {
    title: "お探しの回答が見つかりませんか?",
    subtitle: "サポートチームへいつでもお問い合わせください",
    action: "連絡する",
  },
  CN: {
    title: "还没有找到需要的答案?",
    subtitle: "随时联系我们的支持团队",
    action: "联系我们",
  },
};

export default function AppFaq() {
  const { language, changeLanguage } = useLanguage();
  const router = useRouter();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const languages = ["TH", "EN", "JP", "CN"];
  const content = faqContent[language] || faqContent.TH;
  const description = faqDescription[language] || faqDescription.TH;
  const contactCta = faqContactCta[language] || faqContactCta.TH;
  const orderedFaqItems = faqItemOrder
    .map((itemIndex) => ({
      ...content.items[itemIndex],
      icon: faqIcons[itemIndex],
    }))
    .filter((item) => item.question);

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
    <div className="flex min-h-screen w-full flex-col overflow-y-auto bg-black px-6 pb-8 pt-[84px] text-white no-scrollbar">
      <header className="fixed left-0 right-0 top-0 z-50 flex h-[60px] items-center justify-between bg-black/80 px-4 backdrop-blur-md">
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
            className="h-6 w-auto object-contain"
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

          <button className="flex h-8 w-8 items-center justify-center rounded text-white/90 opacity-60">
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

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          {content.title}
        </h1>
        <p className="whitespace-pre-line text-[14px] font-medium leading-relaxed text-white/60">
          {description}
        </p>
      </div>

      <div className="space-y-4">
        {orderedFaqItems.map((item) => {
          const icon = item.icon;

          return (
          <section
            key={item.question}
            className="rounded-[8px] border border-[#5F2EA1] bg-[linear-gradient(135deg,rgba(23,20,31,0.96),rgba(8,8,12,0.98))] px-4 py-3.5 shadow-[0_0_18px_rgba(126,63,210,0.16),inset_0_0_18px_rgba(255,255,255,0.03)]"
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-white ${icon.className}`}>
                <svg
                  className="h-[17px] w-[17px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {icon.paths}
                </svg>
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <h2 className="mb-1.5 text-[15px] font-extrabold leading-tight text-white">
                  {item.question}
                </h2>
                <p className="text-[12px] font-medium leading-relaxed text-[#AFA8BA]">
                  {item.answer}
                </p>
              </div>
            </div>
          </section>
          );
        })}
      </div>

      <section className="mt-5 rounded-[8px] border border-[#7B35D8] bg-[linear-gradient(135deg,rgba(19,12,30,0.98),rgba(7,7,11,0.98))] p-4 shadow-[0_0_22px_rgba(126,63,210,0.22),inset_0_0_20px_rgba(255,255,255,0.03)]">
        <div className="flex items-center gap-3">
          <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-[#8D48EF] bg-[#170C29] text-[#C482FF] shadow-[0_0_18px_rgba(141,72,239,0.34)]">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-2v-8h4v6Z" />
              <path d="M3 19a2 2 0 0 0 2 2h2v-8H3v6Z" />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-extrabold leading-tight text-white">
              {contactCta.title}
            </h2>
            <p className="mt-1 text-[12px] font-medium leading-snug text-[#AFA8BA]">
              {contactCta.subtitle}
            </p>
          </div>

          <button
            onClick={() => router.push("/contact")}
            className="shrink-0 rounded-[8px] bg-[linear-gradient(180deg,#B46CFF,#7B2DE2)] px-4 py-2.5 text-[13px] font-extrabold text-white shadow-[0_0_16px_rgba(180,108,255,0.34),inset_0_1px_0_rgba(255,255,255,0.34)]"
          >
            {contactCta.action}
          </button>
        </div>
      </section>
    </div>
  );
}
