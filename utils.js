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

// Número por extenso em português (meticais) com regras gramaticais corretas
function numPorExtenso(numero) {
  numero = Math.round(numero * 100) / 100;
  if (!numero || numero === 0) return 'Zero meticais';

  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const dezenas10 = ['dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezasseis', 'dezassete', 'dezoito', 'dezanove'];
  const dezenas = ['', 'dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  // Função interna para converter blocos de 3 dígitos (0 a 999)
  function converteBloco(n) {
    if (n === 0) return '';
    if (n === 100) return 'cem'; // "Cem" apenas quando é 100 exato
    
    let c = Math.floor(n / 100);
    let d = Math.floor((n % 100) / 10);
    let u = n % 10;
    
    let partes = [];
    if (c > 0) partes.push(centenas[c]); // Se passou de 100, já usa "cento"
    
    if (d === 1) {
      partes.push(dezenas10[u]);
    } else {
      if (d > 1) partes.push(dezenas[d]);
      if (u > 0) partes.push(unidades[u]);
    }
    
    return partes.join(' e ');
  }

  let meticais = Math.floor(numero);
  let centavos = Math.round((numero - meticais) * 100);
  let resultado = [];
  
  if (meticais > 0) {
    let bilhoes = Math.floor(meticais / 1000000000);
    let milhoes = Math.floor((meticais % 1000000000) / 1000000);
    let milhares = Math.floor((meticais % 1000000) / 1000);
    let resto = meticais % 1000;
    
    let partesMeticais = [];
    
    if (bilhoes > 0) {
      partesMeticais.push(converteBloco(bilhoes) + (bilhoes === 1 ? ' bilião' : ' biliões'));
    }
    
    if (milhoes > 0) {
      partesMeticais.push(converteBloco(milhoes) + (milhoes === 1 ? ' milhão' : ' milhões'));
    }
    
    if (milhares > 0) {
      let strMilhares = converteBloco(milhares);
      if (strMilhares === 'um') strMilhares = ''; // Para evitar dizer "um mil", fica apenas "mil"
      partesMeticais.push((strMilhares ? strMilhares + ' ' : '') + 'mil');
    }
    
    if (resto > 0) {
      let strResto = converteBloco(resto);
      if (partesMeticais.length > 0) {
         // Adiciona "e" se for menor que 100 ou se for centena exata (ex: mil e cem, mil e vinte)
         if (resto < 100 || resto % 100 === 0) {
            partesMeticais.push('e ' + strResto);
         } else {
            partesMeticais.push(strResto); // Ex: mil novecentos (sem o 'e')
         }
      } else {
         partesMeticais.push(strResto);
      }
    } else if ((bilhoes > 0 || milhoes > 0) && milhares === 0 && resto === 0) {
      partesMeticais.push('de'); // Ex: Um milhão de meticais
    }
    
    let strExtenso = partesMeticais.join(' ').replace(/\s+/g, ' ').trim();
    strExtenso += (meticais === 1 ? ' metical' : ' meticais');
    resultado.push(strExtenso);
  }
  
  if (centavos > 0) {
    let strCentavos = converteBloco(centavos) + (centavos === 1 ? ' centavo' : ' centavos');
    resultado.push(strCentavos);
  }
  
  let finalStr = resultado.join(' e ');
  // Retorna com a primeira letra maiúscula
  return finalStr.charAt(0).toUpperCase() + finalStr.slice(1);
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
