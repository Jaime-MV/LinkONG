import { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = 'admin' | 'coordinador' | 'voluntario';

export interface AuthUser {
  id: string;
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

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Usuarios de demostración (fallback cuando el backend no está corriendo) ───
const DEMO_USERS: Record<string, { password: string; id: string; nombre: string; rol: string }> = {
  'admin@linkong.org': {
    password: 'admin123',
    id: 'demo-admin-001',
    nombre: 'Admin LinkONG',
    rol: 'Admin',
  },
  'coord@linkong.org': {
    password: 'coord123',
    id: 'demo-coord-001',
    nombre: 'Coordinador Demo',
    rol: 'Coordinador',
  },
  'voluntario@linkong.org': {
    password: 'vol123',
    id: 'demo-vol-001',
    nombre: 'Voluntario Demo',
    rol: 'Voluntario',
  },
};

function buildAuthUser(data: { id: string; nombre: string; correo: string; rol: string }): AuthUser {
  const initials = data.nombre
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'US';

  return {
    id: data.id,
    name: data.nombre,
    email: data.correo,
    role: data.rol.toLowerCase() as UserRole,
    avatarInitials: initials,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string) => {
    // ── Intentar con el backend real (timeout de 7 segundos) ──────────────────
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, contrasena: password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setUser(buildAuthUser({ ...data, correo: data.correo ?? email }));
        return { ok: true };
      }

      const errorData = await response.json().catch(() => ({ error: 'Error de servidor' }));
      return { ok: false, error: errorData.error || 'Credenciales incorrectas.' };

    } catch (e: any) {
      clearTimeout(timeoutId);

      const isOffline = e.name === 'AbortError' || e.message?.includes('fetch') || e.message?.includes('Failed');

      if (isOffline) {
        // ── Fallback: credenciales de demostración ────────────────────────────
        const demo = DEMO_USERS[email.toLowerCase()];
        if (demo && demo.password === password) {
          setUser(buildAuthUser({
            id: demo.id,
            nombre: demo.nombre,
            correo: email,
            rol: demo.rol,
          }));
          return { ok: true };
        }

        return {
          ok: false,
          error: '⚠️ Backend no disponible. Usa las credenciales de demostración (ej: admin@linkong.org / admin123).',
        };
      }

      console.error(e);
      return { ok: false, error: 'Error inesperado. Intenta de nuevo.' };
    }
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
