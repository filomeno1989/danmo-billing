// ============================================================
// DANMO SS — Gestor de Temas
// ============================================================

const TEMAS = {
  oceano:   { nome:'Oceano',   emoji:'🔵', escuro:{ primary:'#0a1628', primary2:'#0f2040', primary3:'#162d55', accent:'#f59e0b', accent2:'#d97706' }, claro:{ primary:'#dbeafe', primary2:'#eff6ff', primary3:'#bfdbfe', accent:'#1d4ed8', accent2:'#1e40af' } },
  floresta: { nome:'Floresta', emoji:'🟢', escuro:{ primary:'#052e16', primary2:'#14532d', primary3:'#166534', accent:'#4ade80', accent2:'#16a34a' }, claro:{ primary:'#dcfce7', primary2:'#f0fdf4', primary3:'#bbf7d0', accent:'#15803d', accent2:'#166534' } },
  roxo:     { nome:'Roxo',     emoji:'🟣', escuro:{ primary:'#1e0a3c', primary2:'#2e1065', primary3:'#3b0764', accent:'#c084fc', accent2:'#a855f7' }, claro:{ primary:'#f3e8ff', primary2:'#faf5ff', primary3:'#e9d5ff', accent:'#7e22ce', accent2:'#6b21a8' } },
  carvao:   { nome:'Carvão',   emoji:'⚫', escuro:{ primary:'#0a0a0a', primary2:'#171717', primary3:'#262626', accent:'#f59e0b', accent2:'#d97706' }, claro:{ primary:'#f5f5f5', primary2:'#fafafa', primary3:'#e5e5e5', accent:'#374151', accent2:'#1f2937' } },
  rubi:     { nome:'Rubi',     emoji:'🔴', escuro:{ primary:'#1c0a0a', primary2:'#3b0f0f', primary3:'#7f1d1d', accent:'#fca5a5', accent2:'#ef4444' }, claro:{ primary:'#fee2e2', primary2:'#fff1f2', primary3:'#fecaca', accent:'#b91c1c', accent2:'#991b1b' } }
};

const tema = {
  get() {
    return { cor: localStorage.getItem('danmo_tema_cor')||'oceano', modo: localStorage.getItem('danmo_tema_modo')||'escuro' };
  },
  aplicar(cor, modo) {
    cor = cor||this.get().cor; modo = modo||this.get().modo;
    const t = TEMAS[cor]; if(!t) return;
    const v = t[modo];
    const r = document.documentElement;
    r.style.setProperty('--navy',  v.primary);
    r.style.setProperty('--navy2', v.primary2);
    r.style.setProperty('--navy3', v.primary3);
    r.style.setProperty('--amber', v.accent);
    r.style.setProperty('--amber2',v.accent2);
    if (modo==='claro') {
      r.style.setProperty('--white', '#1a1a1a');
      r.style.setProperty('--light', '#374151');
      r.style.setProperty('--steel', '#4b5563');
      r.style.setProperty('--steel2','#6b7280');
      r.style.setProperty('--border','rgba(0,0,0,0.12)');
      r.style.setProperty('--card',  'rgba(255,255,255,0.92)');
    } else {
      r.style.setProperty('--white', '#f8fafc');
      r.style.setProperty('--light', '#e2e8f0');
      r.style.setProperty('--steel', '#94a3b8');
      r.style.setProperty('--steel2','#64748b');
      r.style.setProperty('--border','rgba(148,163,184,0.2)');
      r.style.setProperty('--card',  'rgba(15,32,64,0.85)');
    }
    localStorage.setItem('danmo_tema_cor', cor);
    localStorage.setItem('danmo_tema_modo', modo);
    actualizarPainel(cor, modo);
  },
  init() { const {cor,modo}=this.get(); this.aplicar(cor,modo); }
};

function criarPainelTemas() {
  if (document.getElementById('painel-temas')) return;
  const {cor:corA, modo:modoA} = tema.get();
  const painel = document.createElement('div');
  painel.id = 'painel-temas';
  painel.style.cssText = `position:fixed;top:68px;right:16px;z-index:9999;background:var(--navy2);border:1px solid var(--border);border-radius:10px;padding:1.2rem;width:265px;box-shadow:0 8px 32px rgba(0,0,0,0.5);backdrop-filter:blur(10px);display:none;font-family:'Source Sans 3',sans-serif;`;
  painel.innerHTML = `
    <div style="font-family:'Bebas Neue';font-size:16px;letter-spacing:2px;color:var(--amber);margin-bottom:12px;">🎨 Aparência</div>
    <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--steel);margin-bottom:6px;">Modo</div>
    <div style="display:flex;gap:6px;margin-bottom:14px;">
      <button id="btn-escuro" onclick="mudarModo('escuro')" style="flex:1;padding:8px;border-radius:6px;cursor:pointer;font-family:'Source Sans 3';font-size:12px;font-weight:600;transition:all 0.2s;">🌙 Escuro</button>
      <button id="btn-claro"  onclick="mudarModo('claro')"  style="flex:1;padding:8px;border-radius:6px;cursor:pointer;font-family:'Source Sans 3';font-size:12px;font-weight:600;transition:all 0.2s;">☀️ Claro</button>
    </div>
    <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--steel);margin-bottom:8px;">Cor</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;" id="grid-cores">
      ${Object.entries(TEMAS).map(([key,t])=>`<button id="btn-cor-${key}" onclick="mudarCor('${key}')" style="padding:8px 10px;border-radius:6px;cursor:pointer;font-family:'Source Sans 3';font-size:12px;font-weight:600;transition:all 0.2s;text-align:left;">${t.emoji} ${t.nome}</button>`).join('')}
    </div>
    <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border);font-size:11px;color:var(--steel2);">Preferência guardada automaticamente</div>`;
  document.body.appendChild(painel);
  actualizarPainel(corA, modoA);
  document.addEventListener('click', function(e) {
    if (!painel.contains(e.target) && !e.target.closest('#btn-tema-header')) {
      painel.style.display = 'none';
    }
  });
}

function togglePainelTemas() {
  criarPainelTemas();
  const p = document.getElementById('painel-temas');
  p.style.display = p.style.display==='none'||p.style.display==='' ? 'block' : 'none';
}

function mudarModo(modo) { tema.aplicar(tema.get().cor, modo); }
function mudarCor(cor)   { tema.aplicar(cor, tema.get().modo); }

function actualizarPainel(corA, modoA) {
  ['escuro','claro'].forEach(m => {
    const btn = document.getElementById('btn-'+m); if(!btn) return;
    const on = m===modoA;
    btn.style.border     = `2px solid ${on?'var(--amber)':'var(--border)'}`;
    btn.style.background = on ? 'rgba(245,158,11,0.15)' : 'transparent';
    btn.style.color      = on ? 'var(--amber)' : 'var(--steel)';
  });
  Object.keys(TEMAS).forEach(key => {
    const btn = document.getElementById('btn-cor-'+key); if(!btn) return;
    const on = key===corA;
    btn.style.border     = `2px solid ${on?'var(--amber)':'var(--border)'}`;
    btn.style.background = on ? 'rgba(245,158,11,0.15)' : 'transparent';
    btn.style.color      = on ? 'var(--amber)' : 'var(--steel)';
  });
}

tema.init();
