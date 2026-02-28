import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface AdminInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: AdminInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdmin = async () => {
      const savedToken = localStorage.getItem('adminToken');
      const savedInfo = localStorage.getItem('adminInfo');

      if (savedToken && savedInfo) {
        try {
          setToken(savedToken);
          setAdmin(JSON.parse(savedInfo));
          // Verify token is still valid
          await api.get('/api/auth/profile');
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    loadAdmin();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    const data = response.data;

    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminInfo', JSON.stringify(data));
    setToken(data.token);
    setAdmin(data);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
