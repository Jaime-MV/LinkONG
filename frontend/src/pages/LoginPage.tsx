import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) setError(result.error || 'Error desconocido');
  };

  const quickLogin = (role: 'admin' | 'coordinador' | 'voluntario') => {
    const map = {
      admin:        { email: 'admin@linkong.org',     password: 'admin123' },
      coordinador:  { email: 'coord@linkong.org',     password: 'coord123' },
      voluntario:   { email: 'voluntario@linkong.org',password: 'vol123'   },
    };
    setEmail(map[role].email);
    setPassword(map[role].password);
  };

  return (
    <div className="login-page">
      <div className="login-bg" />

      <div className="login-card">
        <div className="login-logo">
          <h1>Link<span>ONG</span></h1>
          <p>Plataforma de Gestión de Voluntariado</p>
        </div>

        <h2 className="login-title">Bienvenido de vuelta</h2>
        <p className="login-sub">Ingresa tus credenciales para continuar</p>

        {error && <div className="alert alert-danger mb-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input
              id="login-email"
              type="email" className="form-control"
              placeholder="usuario@linkong.org"
              value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              id="login-password"
              type="password" className="form-control"
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              required autoComplete="current-password"
            />
          </div>
          <button id="btn-login" type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
            {loading ? '⏳ Verificando...' : '🔑 Iniciar Sesión'}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0 0.75rem', textAlign: 'center' }}>
          <span className="text-xs text-muted">— Acceso rápido para demostración —</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <button id="quick-admin"       className="btn btn-secondary btn-sm" onClick={() => quickLogin('admin')}>
            🏛️ Admin
          </button>
          <button id="quick-coordinador" className="btn btn-secondary btn-sm" onClick={() => quickLogin('coordinador')}>
            👷 Coord.
          </button>
          <button id="quick-voluntario"  className="btn btn-secondary btn-sm" onClick={() => quickLogin('voluntario')}>
            🙋 Volunt.
          </button>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-card2)', borderRadius: 'var(--radius-sm)' }}>
          <p className="text-xs text-muted" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Credenciales de prueba:</p>
          <p className="text-xs text-muted">🏛️ admin@linkong.org / admin123</p>
          <p className="text-xs text-muted">👷 coord@linkong.org / coord123</p>
          <p className="text-xs text-muted">🙋 voluntario@linkong.org / vol123</p>
        </div>
      </div>
    </div>
  );
}
