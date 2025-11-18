// Cookie utility functions

export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
};

export const setCookie = (name, value, days = 7) => {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
};

export const deleteCookie = (name) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const isAuthenticated = () => {
  // Check if adminToken cookie exists
  // Note: Since the cookie is httpOnly, we can't read it from JavaScript
  // We'll check by making a request or using a separate non-httpOnly cookie
  // For now, we'll use a simple flag cookie that's not httpOnly
  return getCookie('adminAuthed') === 'true';
};

export const setAuthFlag = (value = true) => {
  setCookie('adminAuthed', value ? 'true' : 'false', 7);
};

export const clearAuth = () => {
  deleteCookie('adminAuthed');
  // Also clear any stored admin token used for Authorization header
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('adminToken');
  }
};

// Admin token helpers (stored in localStorage for API Authorization header)
export const setAdminToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem('adminToken', token);
  }
};

export const getAdminToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('adminToken');
};

