// src/api/auth.js
import http from './http';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await http.post('/api/auth/login', { username, password });
      const token = response.data?.access_token;
      if (!token) return { success: false, error: 'Resposta inválida do servidor' };

      localStorage.setItem('auth_token', token);

      const userResponse = await http.get('/api/auth/me');
      localStorage.setItem('auth_user', JSON.stringify(userResponse.data));

      return { success: true, user: userResponse.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Erro ao fazer login',
      };
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  },

  isAuthenticated: () => !!localStorage.getItem('auth_token'),

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('auth_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  validateToken: async () => {
    try {
      const response = await http.get('/api/auth/me');
      return { valid: true, user: response.data };
    } catch {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      return { valid: false };
    }
  },
};

export default authService;