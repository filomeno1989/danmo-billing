// ============================================================
// DANMO SS — Gestão de Temas
// ============================================================

const TEMAS = {
  azul:   { nome: 'Azul Marinho', primary: '#0a1628', secondary: '#0f2040', accent: '#f59e0b' },
  verde:  { nome: 'Verde Floresta', primary: '#0a2010', secondary: '#0f3020', accent: '#22c55e' },
  roxo:   { nome: 'Roxo Real', primary: '#1a0a28', secondary: '#2a1040', accent: '#a855f7' },
  cinza:  { nome: 'Cinza Industrial', primary: '#141414', secondary: '#1e1e1e', accent: '#94a3b8' },
  bordo:  { nome: 'Bordô', primary: '#1a0a0a', secondary: '#2a1010', accent: '#ef4444' },
};

const tema = {

  // Aplicar tema guardado (chamar no início de cada página)
  aplicar() {
    const cor   = localStorage.getItem('danmo_cor')  || 'azul';
    const modo  = localStorage.getItem('danmo_modo') || 'escuro';
    this.setCor(cor);
    this.setModo(modo);
  },

  // Definir cor
  setCor(cor) {
    const t = TEMAS[cor] || TEMAS.azul;
    const r = document.documentElement.style;
    r.setProperty('--navy',  t.primary);
    r.setProperty('--navy2', t.secondary);
    r.setProperty('--navy3', t.secondary + 'cc');
    r.setProperty('--amber', t.accent);
    r.setProperty('--amber2', this._darken(t.accent));
    localStorage.setItem('danmo_cor', cor);
    document.documentElement.setAttribute('data-cor', cor);
  },

  // Definir modo claro/escuro
  setModo(modo) {
    document.documentElement.setAttribute('data-modo', modo);
    if (modo === 'claro') {
      const r = document.documentElement.style;
      r.setProperty('--white',  '#1a1a2e');
      r.setProperty('--light',  '#2a2a4e');
      r.setProperty('--steel',  '#4a5568');
      r.setProperty('--steel2', '#2d3748');
      r.setProperty('--border', 'rgba(0,0,0,0.15)');
      r.setProperty('--card',   'rgba(255,255,255,0.92)');
      document.body.style.background = '#f0f2f5';
      document.body.style.backgroundImage = 'none';
    } else {
      const r = document.documentElement.style;
      r.setProperty('--white',  '#f8fafc');
      r.setProperty('--light',  '#e2e8f0');
      r.setProperty('--steel',  '#94a3b8');
      r.setProperty('--steel2', '#64748b');
      r.setProperty('--border', 'rgba(148,163,184,0.2)');
      r.setProperty('--card',   'rgba(15,32,64,0.85)');
      document.body.style.background = '';
      document.body.style.backgroundImage = '';
    }
    localStorage.setItem('danmo_modo', modo);
  },

  getCor()  { return localStorage.getItem('danmo_cor')  || 'azul'; },
  getModo() { return localStorage.getItem('danmo_modo') || 'escuro'; },

  _darken(hex) {
    // Escurece ligeiramente a cor accent
    const num = parseInt(hex.replace('#',''), 16);
    const r   = Math.max(0, (num >> 16) - 30);
    const g   = Math.max(0, ((num >> 8) & 0xff) - 30);
    const b   = Math.max(0, (num & 0xff) - 30);
    return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');
  }
};

// Aplicar imediatamente ao carregar
tema.aplicar();
