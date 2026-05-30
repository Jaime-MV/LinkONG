import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBackToExplorer: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab,
  onBackToExplorer
}) => {
  return (
    <div style={{ display: 'flex', minHeight: '80vh', gap: '2rem', width: '100%' }}>
      {/* Admin Sidebar Navigation Panel - Master Page Secundaria */}
      <aside style={{ 
        flex: '0 0 260px', 
        background: 'var(--bg-card)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '20px', 
        padding: '1.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem' 
      }}>
        <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Sección Administrativa</h3>
          <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600, letterSpacing: '0.5px' }}>ROL: ADMINISTRADOR</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
          <button 
            onClick={() => setActiveTab('ngos')}
            className={`nav-link ${activeTab === 'ngos' ? 'active' : ''}`}
            style={{ 
              textAlign: 'left', 
              background: activeTab === 'ngos' ? 'var(--primary-glow)' : 'none', 
              border: 'none', 
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              color: activeTab === 'ngos' ? '#818cf8' : 'var(--text-secondary)',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            🏢 Gestionar ONGs
          </button>

          <button 
            onClick={() => setActiveTab('volunteers')}
            className={`nav-link ${activeTab === 'volunteers' ? 'active' : ''}`}
            style={{ 
              textAlign: 'left', 
              background: activeTab === 'volunteers' ? 'var(--primary-glow)' : 'none', 
              border: 'none', 
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              color: activeTab === 'volunteers' ? '#818cf8' : 'var(--text-secondary)',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            🤝 Gestionar Voluntarios
          </button>

          <button 
            onClick={() => setActiveTab('projects')}
            className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
            style={{ 
              textAlign: 'left', 
              background: activeTab === 'projects' ? 'var(--primary-glow)' : 'none', 
              border: 'none', 
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              color: activeTab === 'projects' ? '#818cf8' : 'var(--text-secondary)',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            📂 Gestionar Proyectos
          </button>
        </nav>

        <button 
          onClick={onBackToExplorer}
          className="btn-secondary"
          style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: '0.85rem', padding: '0.65rem' }}
        >
          ⬅ Salir de Admin
        </button>
      </aside>

      {/* Admin Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {children}
      </div>
    </div>
  );
};
