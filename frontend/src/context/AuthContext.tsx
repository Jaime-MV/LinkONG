/* LinkONG Global Authentication Context */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { UserSession } from '../services/authService';

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (correo: string, contrasena: string) => Promise<UserSession>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on mount
    const session = authService.getCurrentSession();
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  const login = async (correo: string, contrasena: string): Promise<UserSession> => {
    setLoading(true);
    try {
      const session = await authService.login(correo, contrasena);
      setUser(session);
      return session;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return context;
};
