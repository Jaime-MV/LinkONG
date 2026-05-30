import { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = 'admin' | 'coordinador' | 'voluntario';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const MOCK_USERS: (AuthUser & { password: string })[] = [
  { id: 1, name: 'Carlos Rivas',    email: 'admin@linkong.org',     password: 'admin123',    role: 'admin',        avatarInitials: 'CR' },
  { id: 2, name: 'María González',  email: 'coord@linkong.org',     password: 'coord123',    role: 'coordinador',  avatarInitials: 'MG' },
  { id: 3, name: 'Juan Pérez',      email: 'voluntario@linkong.org',password: 'vol123',      role: 'voluntario',   avatarInitials: 'JP' },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 700)); // simulate network
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...authUser } = found;
      void _;
      setUser(authUser);
      return { ok: true };
    }
    return { ok: false, error: 'Credenciales incorrectas. Verifica tu correo y contraseña.' };
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
