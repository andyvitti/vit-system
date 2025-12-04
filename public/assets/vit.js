/*
 * VIT System Global Utilities
 * Shared helpers for UI feedback, session handling, navigation, Firestore access, and DOM utilities.
 */

(() => {
  'use strict';

  const COLORS = {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#38bdf8',
    background: 'rgba(4, 7, 10, 0.9)',
    border: '#1f2937'
  };

  const SESSION_KEYS = {
    company: 'vitCompany',
    warehouse: 'vitWarehouse',
    user: 'vitUser',
    role: 'vitRole'
  };

  const qs = (selector) => document.querySelector(selector);
  const qsa = (selector) => document.querySelectorAll(selector);
  const ce = (tag) => document.createElement(tag);

  const vitLog = (...msg) => console.log('[VIT]', ...msg);

  const sanitizeInput = (str) => {
    if (str === undefined || str === null) return '';
    return String(str).replace(/[<>]/g, '').trim();
  };

  const ensureElement = (id, styles = {}, parent = document.body) => {
    let el = document.getElementById(id);
    if (!el) {
      el = ce('div');
      el.id = id;
      parent.appendChild(el);
    }
    Object.assign(el.style, styles);
    return el;
  };

  const vitAlert = (message, type = 'info') => {
    const color = COLORS[type] || COLORS.info;
    const alert = ensureElement('vit-alert', {
      position: 'fixed',
      top: '18px',
      left: '50%',
      transform: 'translateX(-50%)',
      minWidth: '280px',
      maxWidth: '420px',
      padding: '12px 16px',
      borderRadius: '12px',
      background: COLORS.background,
      color: '#e5e7eb',
      border: `1px solid ${color}`,
      boxShadow: `0 10px 30px rgba(0,0,0,0.35), 0 0 18px ${color}55`,
      zIndex: '2000',
      textAlign: 'center',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      opacity: '0',
      transition: 'opacity 180ms ease, transform 180ms ease'
    });

    alert.textContent = sanitizeInput(message || '');
    requestAnimationFrame(() => {
      alert.style.opacity = '1';
      alert.style.transform = 'translateX(-50%) translateY(0)';
    });

    clearTimeout(alert.dataset.hideTimer);
    alert.dataset.hideTimer = setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.transform = 'translateX(-50%) translateY(-6px)';
      setTimeout(() => alert.remove(), 220);
    }, 3000);
  };

  const vitLoader = (show = true) => {
    const overlay = ensureElement('vit-loader', {
      position: 'fixed',
      inset: '0',
      background: 'rgba(4, 7, 10, 0.72)',
      backdropFilter: 'blur(3px)',
      display: show ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1900'
    });

    let spinner = overlay.querySelector('.vit-spinner');
    if (!spinner) {
      spinner = ce('div');
      spinner.className = 'vit-spinner';
      Object.assign(spinner.style, {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        border: '6px solid rgba(34,197,94,0.15)',
        borderTopColor: COLORS.success,
        animation: 'vit-spin 1s linear infinite'
      });

      const style = ensureElement('vit-loader-style', {}, document.head);
      if (!style.textContent.includes('vit-spin')) {
        style.textContent = `@keyframes vit-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
      }

      overlay.appendChild(spinner);
    }

    overlay.style.display = show ? 'flex' : 'none';
  };

  const vitToast = (message) => {
    const container = ensureElement('vit-toast-container', {
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: '1800'
    });

    const toast = ce('div');
    Object.assign(toast.style, {
      padding: '12px 14px',
      borderRadius: '12px',
      background: COLORS.background,
      color: '#e5e7eb',
      border: `1px solid ${COLORS.success}`,
      boxShadow: `0 10px 25px rgba(0,0,0,0.4), 0 0 14px ${COLORS.success}44`,
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: '14px',
      opacity: '0',
      transform: 'translateY(6px)',
      transition: 'opacity 200ms ease, transform 200ms ease'
    });

    toast.textContent = sanitizeInput(message || '');
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(6px)';
      setTimeout(() => toast.remove(), 220);
    }, 3000);
  };

  const saveSession = ({ company, warehouse, user, role } = {}) => {
    localStorage.setItem(SESSION_KEYS.company, company || '');
    localStorage.setItem(SESSION_KEYS.warehouse, warehouse || '');
    localStorage.setItem(SESSION_KEYS.user, user || '');
    localStorage.setItem(SESSION_KEYS.role, role || '');
  };

  const loadSession = () => ({
    company: localStorage.getItem(SESSION_KEYS.company) || '',
    warehouse: localStorage.getItem(SESSION_KEYS.warehouse) || '',
    user: localStorage.getItem(SESSION_KEYS.user) || '',
    role: localStorage.getItem(SESSION_KEYS.role) || ''
  });

  const clearSession = () => {
    Object.values(SESSION_KEYS).forEach((key) => localStorage.removeItem(key));
  };

  const roleRedirect = () => {
    const { role } = loadSession();
    const destinations = {
      admin: '/WMS/companyadmin.html',
      manager: '/WMS/app.html',
      picker: '/WMS/pickerapp.html',
      driver: '/TMS/driversapp.html'
    };

    const target = destinations[role];
    if (target) {
      window.location.href = target;
      return;
    }
    window.location.href = '/index.html';
  };

  const getDb = () => {
    if (!window.firebase || typeof window.firebase.firestore !== 'function') {
      throw new Error('Firebase has not been initialized.');
    }
    return window.firebase.firestore();
  };

  const getCompanyRef = (companyId) => getDb().collection('companies').doc(sanitizeInput(companyId));
  const getWarehouseRef = (companyId, warehouseId) => getCompanyRef(companyId).collection('warehouses').doc(sanitizeInput(warehouseId));
  const getUserRef = (companyId, warehouseId, username) => getWarehouseRef(companyId, warehouseId).collection('users').doc(sanitizeInput(username));

  const fetchCompany = async (companyId) => getCompanyRef(companyId).get();
  const fetchWarehouses = async (companyId) => getCompanyRef(companyId).collection('warehouses').get();
  const fetchUser = async (companyId, warehouseId, username) => getUserRef(companyId, warehouseId, username).get();

  const handleError = (error, showToUser = true) => {
    const message = error?.message || 'An unexpected error occurred.';
    console.error('[VIT]', error);
    if (showToUser) {
      vitAlert(message, 'error');
    }
    return message;
  };

  window.vit = {
    vitAlert,
    vitLoader,
    vitToast,
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
    qs,
    qsa,
    ce,
    vitLog,
    sanitizeInput,
    handleError
  };
})();
