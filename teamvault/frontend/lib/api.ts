const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isAdmin: boolean;
}

export const getApiUrl = (): string => {
  return API_BASE_URL.replace(/\/$/, '');
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('teamvault_token');
};

export const getUser = (): UserSession | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('teamvault_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setSession = (token: string, user: UserSession): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('teamvault_token', token);
  localStorage.setItem('teamvault_user', JSON.stringify(user));
  window.dispatchEvent(new Event('auth-change'));
};

export const clearSession = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('teamvault_token');
  localStorage.removeItem('teamvault_user');
  window.dispatchEvent(new Event('auth-change'));
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${getApiUrl()}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.message || data.error || `HTTP error ${res.status}`;
    throw new Error(errorMsg);
  }

  return data;
};

// Authentication
export const login = async (email: string, password: string) => {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.token && data.user) {
    setSession(data.token, data.user);
  }
  return data;
};

// API2 Demo Auth Impersonation
export const impersonateUser = async (userId: string) => {
  const data = await apiRequest(`/api/demo-auth/impersonate?userId=${encodeURIComponent(userId)}`, {
    method: 'GET',
  });
  if (data.token && data.user) {
    setSession(data.token, data.user);
  }
  return data;
};

// User Profile & BOPLA
export const getProfile = async () => {
  return apiRequest('/api/users/profile', { method: 'GET' });
};

export const updateProfile = async (updateData: Record<string, any>) => {
  const data = await apiRequest('/api/users/profile', {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
  // Update local session cache if returned
  if (data.user) {
    const current = getUser();
    if (current) {
      setSession(getToken() || '', {
        ...current,
        name: data.user.name ?? current.name,
        email: data.user.email ?? current.email,
        role: data.user.role ?? current.role,
        isAdmin: data.user.isAdmin ?? current.isAdmin,
      });
    }
  }
  return data;
};

// Documents Service
export const getMyDocuments = async () => {
  return apiRequest('/api/documents', { method: 'GET' });
};

export const getDocumentById = async (id: string) => {
  return apiRequest(`/api/documents/${id}`, { method: 'GET' });
};

export const createDocument = async (title: string, content: string) => {
  return apiRequest('/api/documents', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });
};

export const getDemoDirectory = async () => {
  return apiRequest('/api/documents/demo-directory', { method: 'GET' });
};

// Admin Operations
export const getAdminUsers = async () => {
  return apiRequest('/api/admin/users', { method: 'GET' });
};

export const getAdminStatistics = async () => {
  return apiRequest('/api/admin/statistics', { method: 'GET' });
};
