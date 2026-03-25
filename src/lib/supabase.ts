export const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
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
      if (!response.ok) throw new Error(`Insert failed: ${response.statusText}`);
      return { data: await response.json(), error: null };
    } catch (e: any) {
      console.error(e);
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
      if (!response.ok) throw new Error(`Select failed: ${response.statusText}`);
      return { data: await response.json(), error: null };
    } catch (e: any) {
      console.error(e);
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
      if (!response.ok) throw new Error(`Update failed: ${response.statusText}`);
      return { data: await response.json(), error: null };
    } catch (e: any) {
      console.error(e);
      return { data: null, error: e.message };
    }
  }
};
