import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const result = await authService.validateToken();
        if (result.valid) {
          setUser(result.user);
          setIsAuthenticated(true);
        }
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const result = await authService.login(username, password);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch {
      return { success: false, error: 'Erro ao fazer login' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};

export default AuthContext;