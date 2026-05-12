"use client";

import { useLanguage } from "../LanguageContext";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SUPABASE_HEADERS, supabaseRestUrl } from "../lib/supabase";
import { useClickOutside } from "../hooks/useClickOutside";

export default function GenreDetail() {
  const { language, t, changeLanguage } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id || searchParams.get("id");

  const [category, setCategory] = useState(null);
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef(null);

  const headers = SUPABASE_HEADERS;

  useClickOutside(langDropdownRef, () => setIsLangOpen(false));

  useEffect(() => {
    async function fetchData() {
      if (!id || id === "undefined") return;
      
      try {
        setLoading(true);
        // Fetch Genre
        const genreRes = await fetch(
          supabaseRestUrl(`genre?select=*&id=eq.${id}`),
          { headers },
        );
        
        if (!genreRes.ok) {
          const errText = await genreRes.text();
          console.error(`API Error: ${genreRes.status}`, errText);
          throw new Error(`API request failed: ${genreRes.status}`);
        }
        
        const genresInfo = await genreRes.json();
        if (!Array.isArray(genresInfo) || genresInfo.length === 0) {
          router.push("/");
          return;
        }

        const genre = genresInfo[0];
        setCategory(genre);

        // Fetch Series with this genre
        const seriesRes = await fetch(
          supabaseRestUrl(
            `series?select=id,title_th,title_en,title_jp,title_cn,poster_url&genre_ids=cs.{${genre.id}}&order=id.desc`,
          ),
          { headers }
        );
        if (!seriesRes.ok) throw new Error(`Series fetch failed: ${seriesRes.status}`);
        const finalSeries = await seriesRes.json();

        setSeriesList(finalSeries);
      } catch (err) {
        console.error("fetchData error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, language]);

  const getCategoryTitle = (cat) => {
    if (!cat) return "";
    switch (language) {
      case "EN": return cat.name_en || cat.name_th || cat.name;
      case "JP": return cat.name_jp || cat.name_th || cat.name;
      case "CN": return cat.name_cn || cat.name_th || cat.name;
      default: return cat.name_th || cat.name;
    }
  };

  const getPrimaryTitle = (series) => {
    switch (language) {
      case "EN": return series.title_en || series.title_th;
      case "JP": return series.title_jp || series.title_th;
      case "CN": return series.title_cn || series.title_th;
      default: return series.title_th || series.title_en;
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-black text-white pb-10 pt-[60px]">
      
      {/* Header matching bill page */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-[60px] items-center justify-between px-4 bg-black/80 backdrop-blur-md">
        <button onClick={() => router.back()} className="p-1 text-white/70 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div className="flex items-center">
           <img src="/minchap.svg" alt="MinChap" className="h-6 w-auto object-contain" />
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selection */}
          <div className="relative" ref={langDropdownRef}>
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 rounded bg-[#1A1A1A] px-2 py-1 text-xs font-semibold text-white/90 border border-white/10 uppercase"
            >
              {language}
              <svg className={`h-3 w-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-20 rounded-lg bg-[#1A1A1A] shadow-lg border border-white/10 py-1 flex flex-col z-50">
                {["TH", "EN", "JP", "CN"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      changeLanguage(lang);
                      setIsLangOpen(false);
                    }}
                    className={`px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors ${language === lang ? 'text-white font-bold' : 'text-white/60'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex items-center justify-center h-8 w-8 rounded text-white/90">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
          </button>

          <button onClick={() => router.push("/")} className="p-1 text-white/70 hover:text-white">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </header>

      {/* Category Title */}
      <h1 className="text-[20px] font-bold text-center mt-6 mb-8">{getCategoryTitle(category)}</h1>

      {/* Series Grid */}
      {loading ? (
        <div className="flex flex-1 justify-center items-center py-20">
          <div className="w-8 h-8 border-2 border-[#BF8EFF] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 px-4">
          {seriesList.map((series) => (
            <div key={series.id} className="bg-[#1A1A1A] rounded-md overflow-hidden flex flex-col shadow-lg border border-white/5 cursor-pointer active:scale-95 transition-transform">
              <div className="w-full aspect-[2/3] relative bg-[#222]">
                {series.poster_url && <img src={series.poster_url} className="object-cover w-full h-full" alt={getPrimaryTitle(series)} />}
              </div>
              <div className="p-2 py-1.5 flex items-center justify-center min-h-[36px]">
                 <p className="text-[10px] text-white/90 text-center leading-tight line-clamp-2">{getPrimaryTitle(series)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && seriesList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-white/30 text-sm italic">
           <p>No titles available in this genre</p>
        </div>
      )}
    </div>
  );
}
