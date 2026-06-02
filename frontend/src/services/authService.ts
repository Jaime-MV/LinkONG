/* LinkONG Authentication Service */
import { request, getMockTable } from './api';

export interface UserSession {
  id: string;
  nombre: string;
  correo: string;
  rol: 'Admin' | 'Coordinador' | 'Voluntario';
  token: string;
}

export const authService = {
  login: async (correo: string, contrasena: string): Promise<UserSession> => {
    return request<UserSession>('POST', '/auth/login', { correo, contrasena }, () => {
      // Mock Handler
      const normalizedEmail = correo.trim().toLowerCase();

      // Check in Coordinadores first
      const coordTable = getMockTable('coordinadores');
      const foundCoord = coordTable.find((c) => c.correo.toLowerCase() === normalizedEmail);
      if (foundCoord) {
        const session: UserSession = {
          id: foundCoord.id,
          nombre: foundCoord.nombre,
          correo: foundCoord.correo,
          rol: foundCoord.rol, // 'Admin' or 'Coordinador'
          token: `mock-jwt-token-for-${foundCoord.id}`
        };
        localStorage.setItem('lk_session', JSON.stringify(session));
        localStorage.setItem('lk_token', session.token);
        return session;
      }

      // Check in Voluntarios next
      const volTable = getMockTable('voluntarios');
      const foundVol = volTable.find((v) => v.correoElectronico.toLowerCase() === normalizedEmail);
      if (foundVol) {
        // Only allow active or in-induction volunteers to log in
        const session: UserSession = {
          id: foundVol.id,
          nombre: foundVol.nombreCompleto,
          correo: foundVol.correoElectronico,
          rol: 'Voluntario',
          token: `mock-jwt-token-for-${foundVol.id}`
        };
        localStorage.setItem('lk_session', JSON.stringify(session));
        localStorage.setItem('lk_token', session.token);
        return session;
      }

      throw new Error('Credenciales inválidas. Intente con: admin@linkong.org, coord@linkong.org o juan@gmail.com.');
    });
  },

  getCurrentSession: (): UserSession | null => {
    const raw = localStorage.getItem('lk_session');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserSession;
    } catch {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('lk_session');
    localStorage.removeItem('lk_token');
  }
};
