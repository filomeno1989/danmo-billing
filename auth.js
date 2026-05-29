// ============================================================
// DANMO SS — Autenticação e Permissões
// ============================================================

const auth = {

  // Guardar sessão
  login(utilizador) {
    sessionStorage.setItem('danmo_user', JSON.stringify(utilizador));
  },

  // Terminar sessão
  logout() {
    sessionStorage.removeItem('danmo_user');
    window.location.href = 'index.html';
  },

  // Obter utilizador actual
  getUser() {
    const raw = sessionStorage.getItem('danmo_user');
    return raw ? JSON.parse(raw) : null;
  },

  // Verificar se está autenticado (redireciona se não)
  require() {
    const user = this.getUser();
    if (!user) {
      window.location.href = 'index.html';
      return null;
    }
    return user;
  },

  // Verificar nível de acesso
  isAdmin()   { return this.getUser()?.nivel === 'admin'; },
  isGestor()  { return ['admin','gestor'].includes(this.getUser()?.nivel); },
  isOperador(){ return !!this.getUser(); },

  // Permissões por acção
  pode: {
    verDashboard()      { return !!auth.getUser(); },
    criarDocumento()    { return auth.isGestor(); },
    editarDocumento()   { return auth.isGestor(); },
    apagarDocumento()   { return auth.isAdmin(); },
    verClientes()       { return auth.isGestor(); },
    gerirClientes()     { return auth.isAdmin(); },
    gerirTecnicos()     { return auth.isAdmin(); },
    gerirUtilizadores() { return auth.isAdmin(); },
  }
};

// Níveis e o que cada um vê no menu
const MENU_POR_NIVEL = {
  admin:    ['dashboard', 'editor', 'clientes', 'tecnicos', 'utilizadores'],
  gestor:   ['dashboard', 'editor', 'clientes'],
  operador: ['dashboard']
};
