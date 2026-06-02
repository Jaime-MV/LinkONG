/* LinkONG Premium Login Page */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, User, Key, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const session = await login(correo, contrasena);
      // Redirect based on role
      if (session.rol === 'Admin') {
        navigate('/admin');
      } else if (session.rol === 'Coordinador') {
        navigate('/coordinador');
      } else {
        navigate('/voluntario');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (email: string) => {
    setCorreo(email);
    setContrasena('123456');
    setError(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 10% 20%, rgb(4, 11, 29) 0%, rgb(18, 22, 45) 90.1%)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Blur Spheres */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'hsla(var(--primary-hue), var(--primary-sat), var(--primary-light), 0.15)',
        filter: 'blur(80px)',
        top: '-50px',
        left: '-50px',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'hsla(199, 89%, 48%, 0.12)',
        filter: 'blur(100px)',
        bottom: '-100px',
        right: '-100px',
        pointerEvents: 'none'
      }} />

      <div className="glass-panel anim-fade-in" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '2.5rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(17, 22, 43, 0.75)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        zIndex: 10
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--primary), var(--info))',
            color: 'white',
            boxShadow: 'var(--shadow-glow)',
            marginBottom: '1rem'
          }}>
            <Sparkles size={28} />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800, marginBottom: '0.25rem' }}>LinkONG</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>Plataforma Unificada para Impacto Social</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div className="badge badge-danger" style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              textTransform: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              width: '100%',
              display: 'block',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={16} /> Correo Electrónico
              </span>
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="ejemplo@linkong.org"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff'
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Key size={16} /> Contraseña
              </span>
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              padding: '0.85rem',
              marginTop: '0.5rem',
              fontSize: '1rem',
              width: '100%'
            }}
          >
            {loading ? 'Iniciando sesión...' : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Ingresar al Sistema <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        {/* Quick Fill / Developer tools */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <h4 style={{
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.4)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Shield size={14} /> Acceso Rápido de Pruebas:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => handleQuickFill('admin@linkong.org')}
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.5rem',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0'
              }}
            >
              <span>🔑 Administrador (Staff)</span>
              <code style={{ color: 'var(--primary)' }}>admin@linkong.org</code>
            </button>
            <button
              onClick={() => handleQuickFill('coord@linkong.org')}
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.5rem',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0'
              }}
            >
              <span>👷‍♂️ Coordinador de Campo</span>
              <code style={{ color: 'var(--info)' }}>coord@linkong.org</code>
            </button>
            <button
              onClick={() => handleQuickFill('juan@gmail.com')}
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.5rem',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0'
              }}
            >
              <span>🙋‍♂️ Voluntario Registrado</span>
              <code style={{ color: 'var(--success)' }}>juan@gmail.com</code>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
