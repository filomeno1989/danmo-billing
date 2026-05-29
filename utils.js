// ============================================================
// DANMO SS — Funções Utilitárias Partilhadas
// ============================================================

// Formatar número com separador de milhar e 2 decimais
function fmtNum(n) {
  if (isNaN(n) || n === null || n === undefined) return '0,00';
  return Number(n).toLocaleString('pt-MZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Formatar data de YYYY-MM-DD para DD/MM/YYYY
function fmtData(d) {
  if (!d) return '—';
  const p = d.split('-');
  if (p.length !== 3) return d;
  return `${p[2]}/${p[1]}/${p[0]}`;
}

// Data de hoje em YYYY-MM-DD
function hoje() {
  return new Date().toISOString().split('T')[0];
}

// Número por extenso em português (meticais)
function numPorExtenso(n) {
  n = Math.round(n * 100) / 100;
  if (n === 0) return 'Zero meticais';

  const u = ['','um','dois','três','quatro','cinco','seis','sete','oito','nove',
             'dez','onze','doze','treze','catorze','quinze','dezasseis',
             'dezassete','dezoito','dezanove'];
  const d = ['','dez','vinte','trinta','quarenta','cinquenta',
             'sessenta','setenta','oitenta','noventa'];
  const c = ['','cem','duzentos','trezentos','quatrocentos','quinhentos',
             'seiscentos','setecentos','oitocentos','novecentos'];

  function centenas(n) {
    if (n === 0) return '';
    if (n === 100) return 'cem';
    const h = Math.floor(n / 100);
    const r = n % 100;
    let s = h > 0 ? c[h] : '';
    if (r > 0) {
      if (s) s += ' e ';
      s += r < 20 ? u[r] : d[Math.floor(r / 10)] + (r % 10 > 0 ? ' e ' + u[r % 10] : '');
    }
    return s;
  }

  const intPart = Math.floor(n);
  const decPart = Math.round((n - intPart) * 100);

  const bi = Math.floor(intPart / 1000000000);
  const mi = Math.floor((intPart % 1000000000) / 1000000);
  const th = Math.floor((intPart % 1000000) / 1000);
  const re = intPart % 1000;

  let parts = [];
  if (bi > 0) parts.push(centenas(bi) + (bi === 1 ? ' bilião' : ' biliões'));
  if (mi > 0) parts.push(centenas(mi) + (mi === 1 ? ' milhão' : ' milhões'));
  if (th > 0) parts.push(centenas(th) + ' mil');
  if (re > 0) parts.push(centenas(re));

  let result = parts.join(', ');
  result += intPart === 1 ? ' metical' : ' meticais';
  if (decPart > 0) result += ' e ' + centenas(decPart) + (decPart === 1 ? ' centavo' : ' centavos');

  return result.charAt(0).toUpperCase() + result.slice(1);
}

// Mostrar mensagem de sucesso temporária
function showToast(msg, tipo = 'success') {
  const cores = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed; bottom:24px; right:24px;
    background:${cores[tipo]||cores.success}; color:white;
    padding:14px 22px; border-radius:8px; font-size:14px;
    z-index:9999; box-shadow:0 4px 16px rgba(0,0,0,0.3);
    font-family:'Source Sans 3',sans-serif; font-weight:600;
    transition:opacity 0.3s; max-width:350px;
  `;
  t.textContent = (tipo === 'success' ? '✅ ' : tipo === 'error' ? '❌ ' : 'ℹ️ ') + msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
}

// Confirmar acção destrutiva
function confirmar(msg, callback) {
  const overlay = document.getElementById('modal-confirm');
  const msgEl   = document.getElementById('confirm-msg');
  const okBtn   = document.getElementById('confirm-ok-btn');
  if (!overlay || !msgEl || !okBtn) { if (confirm(msg)) callback(); return; }
  msgEl.textContent = msg;
  overlay.classList.add('open');
  okBtn.onclick = () => { overlay.classList.remove('open'); callback(); };
}

// Fechar modal
function fecharModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

// Abrir modal
function abrirModal(id) {
  document.getElementById(id)?.classList.add('open');
}

// Definir valor num campo
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val ?? '';
}

// Obter valor de um campo
function getVal(id) {
  return document.getElementById(id)?.value ?? '';
}

// Gerar próximo número de documento  ex: "005/26"
function proximoNumero(tipo, lista) {
  const anoActual = new Date().getFullYear().toString().slice(-2);
  const docs = lista.filter(d => d.tipo === tipo);
  let maxNum = 0;
  docs.forEach(d => {
    const match = (d.numero || '').match(/^(\d+)\//);
    if (match) { const n = parseInt(match[1]); if (n > maxNum) maxNum = n; }
  });
  return String(maxNum + 1).padStart(3, '0') + '/' + anoActual;
}
