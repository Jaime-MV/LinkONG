import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface NavItem { id: string; icon: string; label: string; }

interface DashboardShellProps {
  navItems: NavItem[];
  activeSection: string;
  onNav: (id: string) => void;
  pageTitle: string;
  pageSubtitle?: string;
  children: ReactNode;
  roleColor?: string;
  extraHeaderContent?: ReactNode;
}

export function DashboardShell({
  navItems,
  activeSection,
  onNav,
  pageTitle,
  pageSubtitle,
  children,
  roleColor = 'var(--primary-light)',
  extraHeaderContent
}: DashboardShellProps) {
  const { user, logout } = useAuth();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>Link<span>ONG</span></h1>
          <p>Sistema de Gestión Integral</p>
        </div>
        <nav className="sidebar-nav">
          <span className="nav-section-label">Navegación</span>
          {navItems.map(item => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => onNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">{user?.avatarInitials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="user-name" style={{ color: roleColor }}>{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
            <button id="btn-logout" className="btn btn-ghost btn-sm" onClick={logout} title="Cerrar sesión">⏻</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-area">
        <header className="topbar">
          <div>
            <div className="topbar-title">{pageTitle}</div>
            {pageSubtitle && <div className="topbar-subtitle">{pageSubtitle}</div>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {extraHeaderContent}
            <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
            <button id="topbar-logout" className="btn btn-secondary btn-sm" onClick={logout}>Salir</button>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
