// ============================================================
// DANMO SS — Ligação ao Supabase
// ============================================================

const SUPABASE_URL = 'https://czgnbzxoeylicrqjvncd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6Z25ienhvZXlsaWNycWp2bmNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzcxNzcsImV4cCI6MjA5NDc1MzE3N30.g_msMjIqje6UtMf4Cy-eTodGlRKVWIa5Q0-9s5YpJJw';

// Cliente Supabase simples (sem biblioteca externa)
const db = {

  // GET — buscar registos
  async get(tabela, filtros = {}) {
    let url = `${SUPABASE_URL}/rest/v1/${tabela}?select=*`;
    for (const [col, val] of Object.entries(filtros)) {
      url += `&${col}=eq.${encodeURIComponent(val)}`;
    }
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // INSERT — criar registo
  async insert(tabela, dados) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}`, {
      method: 'POST',
      headers: { ...headers(), 'Prefer': 'return=representation' },
      body: JSON.stringify(dados)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // UPDATE — actualizar registo
  async update(tabela, id, dados) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?id=eq.${id}`, {
      method: 'PATCH',
      headers: { ...headers(), 'Prefer': 'return=representation' },
      body: JSON.stringify(dados)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // DELETE — apagar registo
  async delete(tabela, id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?id=eq.${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    if (!res.ok) throw await res.json();
    return true;
  },

  // GET ONE — buscar um registo específico
  async getOne(tabela, filtros = {}) {
    const lista = await this.get(tabela, filtros);
    return lista[0] || null;
  }
};

function headers() {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  };
}
