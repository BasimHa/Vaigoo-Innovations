import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any; // Cast as any to avoid breaks, but handled in components

export const getSupabaseConfig = () => {
  const url = supabaseUrl;
  const key = supabaseAnonKey || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return { url, key };
};

export const supabaseREST = {
  async insert(table: string, data: any) {
    const { url, key } = getSupabaseConfig();
    if (!url || !key) {
      console.warn("Supabase credentials missing, skipping DB insert.");
      return { data: null, error: "No DB Credentials" };
    }
    
    try {
      const response = await fetch(`${url}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errText = await response.text();
        console.error(`SUPABASE_POST_ERROR [${table}]:`, response.status, errText);
        throw new Error(`Insert failed: ${response.status} ${errText}`);
      }
      return { data: await response.json(), error: null };
    } catch (e: any) {
      console.error("SUPABASE_POST_EXCEPTION:", e.message);
      return { data: null, error: e.message };
    }
  },

  async select(table: string, query: string = 'select=*&order=createdat.desc') {
    const { url, key } = getSupabaseConfig();
    if (!url || !key) return { data: [], error: "No DB Credentials" };

    try {
      const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      if (!response.ok) {
        const errText = await response.text();
        console.error(`SUPABASE_GET_ERROR [${table}]:`, response.status, errText);
        throw new Error(`Select failed: ${response.status} ${errText}`);
      }
      return { data: await response.json(), error: null };
    } catch (e: any) {
      console.error("SUPABASE_GET_EXCEPTION:", e.message);
      return { data: [], error: e.message };
    }
  },
  
  async update(table: string, id: string, data: any) {
    const { url, key } = getSupabaseConfig();
    if (!url || !key) return { error: "No DB Credentials" };

    try {
      const response = await fetch(`${url}/rest/v1/${table}?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errText = await response.text();
        console.error(`SUPABASE_PATCH_ERROR [${table}]:`, response.status, errText);
        throw new Error(`Update failed: ${response.status} ${errText}`);
      }
      return { data: await response.json(), error: null };
    } catch (e: any) {
      console.error("SUPABASE_PATCH_EXCEPTION:", e.message);
      return { data: null, error: e.message };
    }
  }
};
