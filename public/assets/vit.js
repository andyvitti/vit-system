(function () {
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const ce = (tag) => document.createElement(tag);
  const vitLog = (...msg) => console.log('[VIT]', ...msg);

  const ensureContainer = (id, className) => {
    let el = document.getElementById(id);
    if (!el) {
      el = ce('div');
      el.id = id;
      if (className) el.className = className;
      document.body.appendChild(el);
    }
    return el;
  };

  const sanitizeInput = (str = '') => str.toString().trim();

  const vitAlert = (message, type = 'info') => {
    const container = ensureContainer('vit-alert-container');
    const alert = ce('div');
    alert.className = `vit-alert ${type}`;
    alert.innerHTML = `<span>${message}</span><button class="vit-button secondary" aria-label="Close alert">✕</button>`;
    alert.querySelector('button').onclick = () => alert.remove();
    container.appendChild(alert);
    setTimeout(() => alert.remove(), 4000);
    return alert;
  };

  const vitToast = (message) => {
    const container = ensureContainer('vit-toast-container');
    const toast = ce('div');
    toast.className = 'vit-toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
    return toast;
  };

  const vitLoader = (show = true) => {
    let overlay = document.getElementById('vit-loader-overlay');
    if (!overlay) {
      overlay = ce('div');
      overlay.id = 'vit-loader-overlay';
      overlay.innerHTML = '<div class="vit-spinner" aria-label="Loading"></div>';
      document.body.appendChild(overlay);
    }
    overlay.classList.toggle('hidden', !show);
    return overlay;
  };

  const vitConfirm = (message, onConfirm) => {
    let overlay = document.getElementById('vit-confirm-overlay');
    if (overlay) overlay.remove();
    overlay = ce('div');
    overlay.id = 'vit-confirm-overlay';
    overlay.className = 'vit-modal-backdrop';
    overlay.innerHTML = `
      <div class="vit-modal">
        <h3>Confirm</h3>
        <p>${message}</p>
        <div style="display:flex; gap:10px; margin-top:14px; justify-content:flex-end;">
          <button class="vit-button secondary" id="vit-confirm-cancel">Cancel</button>
          <button class="vit-button" id="vit-confirm-ok">Confirm</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    qs('#vit-confirm-cancel', overlay).onclick = () => overlay.remove();
    qs('#vit-confirm-ok', overlay).onclick = () => {
      overlay.remove();
      onConfirm?.();
    };
    return overlay;
  };

  const saveSession = ({ company, warehouse, user, role }) => {
    localStorage.vitCompany = company || '';
    localStorage.vitWarehouse = warehouse || '';
    localStorage.vitUser = user || '';
    localStorage.vitRole = role || '';
  };

  const loadSession = () => ({
    company: localStorage.vitCompany || '',
    warehouse: localStorage.vitWarehouse || '',
    user: localStorage.vitUser || '',
    role: localStorage.vitRole || '',
  });

  const clearSession = () => {
    delete localStorage.vitCompany;
    delete localStorage.vitWarehouse;
    delete localStorage.vitUser;
    delete localStorage.vitRole;
  };

  const roleRedirect = () => {
    const { role } = loadSession();
    if (!role) return (window.location.href = '/index.html');
    const map = {
      admin: '/WMS/app.html',
      office: '/WMS/app.html',
      manager: '/WMS/app.html',
      picker: '/WMS/pickerapp.html',
      driver: '/TMS/driversapp.html',
    };
    const target = map[role];
    if (target) window.location.href = target;
    else window.location.href = '/index.html';
  };

  const loadModule = async (path) => {
    try {
      const html = await fetch(path).then((r) => r.text());
      const container = document.getElementById('moduleWindow');
      if (container) container.innerHTML = html;
    } catch (err) {
      console.error('Module load error:', err);
    }
  };

  // Firestore helpers
  const getCompanyRef = (companyId) => firebase.firestore().collection('companies').doc(companyId);
  const getWarehouseRef = (companyId, warehouseId) => getCompanyRef(companyId).collection('warehouses').doc(warehouseId);
  const getUserRef = (companyId, warehouseId, username) => getWarehouseRef(companyId, warehouseId).collection('users').doc(username);

  const fetchCompany = async (companyId) => (await getCompanyRef(companyId).get()).data();
  const fetchWarehouses = async (companyId) => (await getCompanyRef(companyId).collection('warehouses').get()).docs.map((d) => ({ id: d.id, ...d.data() }));
  const fetchUser = async (companyId, warehouseId, username) => (await getUserRef(companyId, warehouseId, username).get()).data();

  const handleError = (error, showToUser = true) => {
    console.error('[VIT]', error);
    if (showToUser) vitAlert(error?.message || 'Something went wrong', 'error');
  };

  window.vit = {
    qs,
    qsa,
    ce,
    vitLog,
    vitAlert,
    vitToast,
    vitLoader,
    vitConfirm,
    saveSession,
    loadSession,
    clearSession,
    roleRedirect,
    getCompanyRef,
    getWarehouseRef,
    getUserRef,
    fetchCompany,
    fetchWarehouses,
    fetchUser,
    sanitizeInput,
    handleError,
    loadModule,
  };
})();
