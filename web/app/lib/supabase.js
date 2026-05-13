export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://vxskkaxvlgycokdtuocj.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_EulroVhS18qjuuQ31ERKig_0memrNhJ";

export const SUPABASE_HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

export function supabaseRestUrl(path) {
  return `${SUPABASE_URL}/rest/v1/${path}`;
}
