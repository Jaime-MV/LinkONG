import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, activeView, setActiveView }) => {
  return (
    <>
      {/* Premium Header representing Master Page Principal */}
      <header className="app-header">
        <div className="logo-container" onClick={() => setActiveView('explorer')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">L</div>
          <div className="logo-text">LinkONG</div>
        </div>
        <nav>
          <ul className="nav-links">
            <li>
              <button 
                className={`nav-link ${activeView === 'explorer' ? 'active' : ''}`}
                onClick={() => setActiveView('explorer')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Explorar ONGs
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeView === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveView('admin')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Panel de Administración
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Structural Body */}
      {children}

      {/* Responsive Premium Footer */}
      <footer className="app-footer">
        <p>
          LinkONG Plataforma de Integración Fullstack © {new Date().getFullYear()} — Diseñado bajo Arquitectura en Capas Limpias (REST + JPA)
        </p>
      </footer>
    </>
  );
};
