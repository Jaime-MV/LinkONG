/* LinkONG Responsive Dashboard Shell Layout */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { PaletteSwitcher } from './PaletteSwitcher';
import { 
  Sparkles, LogOut, Menu, X,
  Wallet, Briefcase, Users, Calendar, Clock, UserCheck
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Define sidebar menu items based on role
  const getMenuItems = () => {
    switch (user.rol) {
      case 'Admin':
        return [
          { label: 'Control Financiero', path: '/admin', icon: <Wallet size={18} /> },
          { label: 'Gestión de Proyectos', path: '/admin/proyectos', icon: <Briefcase size={18} /> },
          { label: 'Auditoría Voluntarios', path: '/admin/voluntarios', icon: <Users size={18} /> }
        ];
      case 'Coordinador':
        return [
          { label: 'Mis Proyectos', path: '/coordinador', icon: <Briefcase size={18} /> },
          { label: 'Planificación Actividades', path: '/coordinador/actividades', icon: <Calendar size={18} /> },
          { label: 'Control Asistencia', path: '/coordinador/asistencia', icon: <UserCheck size={18} /> }
        ];
      case 'Voluntario':
        return [
          { label: 'Cartelera Social', path: '/voluntario', icon: <Sparkles size={18} /> },
          { label: 'Inscripción Actividades', path: '/voluntario/inscripcion', icon: <Calendar size={18} /> },
          { label: 'Mi Historial e Impacto', path: '/voluntario/historial', icon: <Clock size={18} /> }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 📱 Header Navbar for Mobile / Top header */}
      <header className="glass-panel" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        borderRadius: 0,
        borderWidth: '0 0 1px 0',
        background: 'var(--bg-glass)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--text-main)',
              width: '40px',
              height: '40px',
              borderRadius: '8px'
            }}
            className="btn-secondary"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontWeight: 800, fontSize: '1.25rem' }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--primary), var(--info))',
              color: 'white'
            }}>
              <Sparkles size={16} />
            </span>
            LinkONG
          </Link>
        </div>

        {/* User Pill Info & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <PaletteSwitcher />
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'right', textAlign: 'right' }} className="mobile-hide">
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.nombre}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.correo}</span>
          </div>

          <span className={`badge ${
            user.rol === 'Admin' ? 'badge-danger' : user.rol === 'Coordinador' ? 'badge-info' : 'badge-success'
          }`}>
            {user.rol === 'Admin' ? 'Staff / Admin' : user.rol === 'Coordinador' ? 'Coordinador Campo' : 'Voluntario'}
          </span>
        </div>
      </header>

      {/* Main container with sliding sidebar */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        
        {/* 🧭 Sidebar navigation */}
        <aside className="glass-panel" style={{
          position: 'fixed',
          top: '70px',
          bottom: 0,
          left: sidebarOpen ? 0 : '-280px',
          width: '280px',
          zIndex: 40,
          borderRadius: 0,
          borderWidth: '0 1px 0 0',
          background: 'var(--bg-surface)',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'var(--transition-normal)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Nav Header */}
            <div>
              <p style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '0.75rem'
              }}>Panel de Operaciones</p>
              
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        background: isActive ? 'var(--primary-soft)' : 'transparent',
                        color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                        transition: 'var(--transition-fast)'
                      }}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Logout Action */}
          <button 
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{
              width: '100%',
              justifyContent: 'center',
              gap: '0.5rem',
              color: 'var(--danger)',
              borderColor: 'transparent',
              background: 'var(--danger-soft)'
            }}
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </aside>

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              top: '70px',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(2px)',
              zIndex: 35
            }}
          />
        )}

        {/* 📂 Main Content Area */}
        <main style={{
          flex: 1,
          padding: '2.5rem 1.5rem',
          marginLeft: '0px', // We can let user trigger sidebar. On wide screens they can toggle it too.
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          overflowX: 'hidden'
        }} className="anim-fade-in">
          <Outlet />
        </main>
      </div>
      
      {/* Footer Branding */}
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-surface)'
      }}>
        © 2026 LinkONG Fundación Habitacional. Todos los derechos reservados.
      </footer>
    </div>
  );
};
