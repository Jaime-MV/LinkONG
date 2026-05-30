import React, { useState } from 'react';

interface Ngo {
  id: number;
  name: string;
  category: string;
  description: string;
  volunteersNeeded: number;
  location: string;
  contactEmail: string;
}

interface Volunteer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  skills: string;
  status: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  budget: number;
  ngoId: number;
}

interface AdminManagementViewProps {
  ngos: Ngo[];
  volunteers: Volunteer[];
  projects: Project[];
  activeTab: string;
  onAddNgo: (ngo: Omit<Ngo, 'id'>) => Promise<boolean>;
  onEditNgo: (id: number, ngo: Ngo) => Promise<boolean>;
  onDeleteNgo: (id: number) => Promise<boolean>;
  onAddVolunteer: (volunteer: Omit<Volunteer, 'id'>) => Promise<boolean>;
  onEditVolunteer: (id: number, volunteer: Volunteer) => Promise<boolean>;
  onDeleteVolunteer: (id: number) => Promise<boolean>;
  onAddProject: (project: Omit<Project, 'id'>) => Promise<boolean>;
  onEditProject: (id: number, project: Project) => Promise<boolean>;
  onDeleteProject: (id: number) => Promise<boolean>;

}

export const AdminManagementView: React.FC<AdminManagementViewProps> = ({
  ngos,
  volunteers,
  projects,
  activeTab,
  onAddNgo,
  onEditNgo,
  onDeleteNgo,
  onAddVolunteer,
  onEditVolunteer,
  onDeleteVolunteer,
  onAddProject,
  onEditProject,
  onDeleteProject,

}) => {
  // Common Form States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // NGO Form fields
  const [ngoName, setNgoName] = useState('');
  const [ngoCategory, setNgoCategory] = useState('');
  const [ngoDesc, setNgoDesc] = useState('');
  const [ngoVolunteers, setNgoVolunteers] = useState(0);
  const [ngoLocation, setNgoLocation] = useState('');
  const [ngoEmail, setNgoEmail] = useState('');

  // Volunteer Form fields
  const [vName, setVName] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vSkills, setVSkills] = useState('');
  const [vStatus, setVStatus] = useState('Pendiente');

  // Project Form fields
  const [pTitle, setPTitle] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pStatus, setPStatus] = useState('Planificado');
  const [pBudget, setPBudget] = useState(0);
  const [pNgoId, setPNgoId] = useState<number>(ngos[0]?.id || 0);

  // Set initial states for Edit NGO
  const startEditNgo = (ngo: Ngo) => {
    setEditingId(ngo.id);
    setIsAdding(false);
    setNgoName(ngo.name);
    setNgoCategory(ngo.category);
    setNgoDesc(ngo.description);
    setNgoVolunteers(ngo.volunteersNeeded);
    setNgoLocation(ngo.location);
    setNgoEmail(ngo.contactEmail);
  };

  // Set initial states for Edit Volunteer
  const startEditVolunteer = (v: Volunteer) => {
    setEditingId(v.id);
    setIsAdding(false);
    setVName(v.fullName);
    setVEmail(v.email);
    setVPhone(v.phone);
    setVSkills(v.skills);
    setVStatus(v.status);
  };

  // Set initial states for Edit Project
  const startEditProject = (p: Project) => {
    setEditingId(p.id);
    setIsAdding(false);
    setPTitle(p.title);
    setPDesc(p.description);
    setPStatus(p.status);
    setPBudget(p.budget);
    setPNgoId(p.ngoId);
  };

  const clearForm = () => {
    setEditingId(null);
    setIsAdding(false);
    
    setNgoName('');
    setNgoCategory('');
    setNgoDesc('');
    setNgoVolunteers(0);
    setNgoLocation('');
    setNgoEmail('');

    setVName('');
    setVEmail('');
    setVPhone('');
    setVSkills('');
    setVStatus('Pendiente');

    setPTitle('');
    setPDesc('');
    setPStatus('Planificado');
    setPBudget(0);
    setPNgoId(ngos[0]?.id || 0);
  };

  const handleNgoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const success = await onEditNgo(editingId, {
        id: editingId,
        name: ngoName,
        category: ngoCategory,
        description: ngoDesc,
        volunteersNeeded: ngoVolunteers,
        location: ngoLocation,
        contactEmail: ngoEmail
      });
      if (success) clearForm();
    } else {
      const success = await onAddNgo({
        name: ngoName,
        category: ngoCategory,
        description: ngoDesc,
        volunteersNeeded: ngoVolunteers,
        location: ngoLocation,
        contactEmail: ngoEmail
      });
      if (success) clearForm();
    }
  };

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const success = await onEditVolunteer(editingId, {
        id: editingId,
        fullName: vName,
        email: vEmail,
        phone: vPhone,
        skills: vSkills,
        status: vStatus
      });
      if (success) clearForm();
    } else {
      const success = await onAddVolunteer({
        fullName: vName,
        email: vEmail,
        phone: vPhone,
        skills: vSkills,
        status: vStatus
      });
      if (success) clearForm();
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const success = await onEditProject(editingId, {
        id: editingId,
        title: pTitle,
        description: pDesc,
        status: pStatus,
        budget: pBudget,
        ngoId: pNgoId
      });
      if (success) clearForm();
    } else {
      const success = await onAddProject({
        title: pTitle,
        description: pDesc,
        status: pStatus,
        budget: pBudget,
        ngoId: pNgoId
      });
      if (success) clearForm();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      
      {/* Title & Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          {activeTab === 'ngos' && 'Gestión de Organizaciones (ONG)'}
          {activeTab === 'volunteers' && 'Gestión de Voluntarios'}
          {activeTab === 'projects' && 'Gestión de Proyectos de Impacto'}
        </h2>
        
        {!editingId && !isAdding && (
          <button className="btn-primary" onClick={() => setIsAdding(true)}>
            ➕ Agregar {activeTab === 'ngos' ? 'ONG' : activeTab === 'volunteers' ? 'Voluntario' : 'Proyecto'}
          </button>
        )}
      </div>

      {/* Forms Area (Create / Edit) */}
      {(isAdding || editingId) && (
        <section style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '20px', 
          padding: '2rem',
          boxShadow: 'var(--shadow-premium)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            {editingId ? '📝 Editar Registro' : '➕ Crear Nuevo Registro'}
          </h3>

          {/* Form 1: NGOs CRUD Form */}
          {activeTab === 'ngos' && (
            <form onSubmit={handleNgoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nombre de la ONG</label>
                  <input type="text" value={ngoName} onChange={(e) => setNgoName(e.target.value)} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Categoría</label>
                  <input type="text" placeholder="Ej: Medio Ambiente, Educación..." value={ngoCategory} onChange={(e) => setNgoCategory(e.target.value)} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Ubicación</label>
                  <input type="text" placeholder="Ej: Monterrey, N.L." value={ngoLocation} onChange={(e) => setNgoLocation(e.target.value)} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Voluntarios Necesarios</label>
                  <input type="number" min="0" value={ngoVolunteers} onChange={(e) => setNgoVolunteers(parseInt(e.target.value) || 0)} required style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Correo de Contacto</label>
                  <input type="email" value={ngoEmail} onChange={(e) => setNgoEmail(e.target.value)} required style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Descripción (Capa de Negocio limita a 1000 letras)</label>
                  <textarea rows={3} value={ngoDesc} onChange={(e) => setNgoDesc(e.target.value)} required style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-primary">Guardar Cambios</button>
                <button type="button" className="btn-secondary" onClick={clearForm}>Cancelar</button>
              </div>
            </form>
          )}

          {/* Form 2: Volunteers CRUD Form */}
          {activeTab === 'volunteers' && (
            <form onSubmit={handleVolunteerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nombre Completo</label>
                  <input type="text" value={vName} onChange={(e) => setVName(e.target.value)} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Correo Electrónico</label>
                  <input type="email" value={vEmail} onChange={(e) => setVEmail(e.target.value)} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Teléfono (Min 7 números)</label>
                  <input type="text" value={vPhone} onChange={(e) => setVPhone(e.target.value)} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Estado de Solicitud</label>
                  <select value={vStatus} onChange={(e) => setVStatus(e.target.value)} style={inputStyle}>
                    <option value="Activo">Activo</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Habilidades (Ej: Idiomas, Computación, Ventas...)</label>
                  <input type="text" value={vSkills} onChange={(e) => setVSkills(e.target.value)} required style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-primary">Guardar Cambios</button>
                <button type="button" className="btn-secondary" onClick={clearForm}>Cancelar</button>
              </div>
            </form>
          )}

          {/* Form 3: Projects CRUD Form */}
          {activeTab === 'projects' && (
            <form onSubmit={handleProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Título del Proyecto</label>
                  <input type="text" value={pTitle} onChange={(e) => setPTitle(e.target.value)} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>ONG Promotora</label>
                  <select 
                    value={pNgoId} 
                    onChange={(e) => setPNgoId(parseInt(e.target.value) || 0)} 
                    required 
                    style={inputStyle}
                  >
                    <option value="">Selecciona la ONG promotora</option>
                    {ngos.map(ngo => (
                      <option key={ngo.id} value={ngo.id}>{ngo.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Presupuesto Asignado ($ USD)</label>
                  <input type="number" min="0" value={pBudget} onChange={(e) => setPBudget(parseFloat(e.target.value) || 0)} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Estado de Avance</label>
                  <select value={pStatus} onChange={(e) => setPStatus(e.target.value)} style={inputStyle}>
                    <option value="Planificado">Planificado</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Completado">Completado</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Descripción de la Iniciativa</label>
                  <textarea rows={3} value={pDesc} onChange={(e) => setPDesc(e.target.value)} required style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-primary">Guardar Cambios</button>
                <button type="button" className="btn-secondary" onClick={clearForm}>Cancelar</button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* Grid Tables Area (List views) */}
      {!editingId && !isAdding && (
        <section style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '20px', 
          padding: '1.25rem',
          boxShadow: 'var(--shadow-premium)',
          overflowX: 'auto'
        }}>
          {activeTab === 'ngos' && (
            <table style={tableStyle}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={thStyle}>Nombre</th>
                  <th style={thStyle}>Categoría</th>
                  <th style={thStyle}>Ubicación</th>
                  <th style={thStyle}>Voluntariado</th>
                  <th style={thStyle}>Contacto</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ngos.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                      No hay registros de ONGs guardados en PostgreSQL.
                    </td>
                  </tr>
                ) : (
                  ngos.map(ngo => (
                    <tr key={ngo.id} style={trStyle}>
                      <td style={tdStyle}><b>{ngo.name}</b></td>
                      <td style={tdStyle}><span className="badge" style={{ margin: 0, fontSize: '0.7rem' }}>{ngo.category}</span></td>
                      <td style={tdStyle}>📍 {ngo.location}</td>
                      <td style={tdStyle}>{ngo.volunteersNeeded} voluntarios</td>
                      <td style={tdStyle}>{ngo.contactEmail}</td>
                      <td style={{ ...tdStyle, display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button className="btn-primary" onClick={() => startEditNgo(ngo)} style={actionBtnStyle}>✏</button>
                        <button className="btn-secondary" onClick={() => onDeleteNgo(ngo.id)} style={{ ...actionBtnStyle, background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>🗑</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'volunteers' && (
            <table style={tableStyle}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={thStyle}>Nombre</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Teléfono</th>
                  <th style={thStyle}>Habilidades</th>
                  <th style={thStyle}>Estado</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                      No hay voluntarios registrados.
                    </td>
                  </tr>
                ) : (
                  volunteers.map(v => (
                    <tr key={v.id} style={trStyle}>
                      <td style={tdStyle}><b>{v.fullName}</b></td>
                      <td style={tdStyle}>{v.email}</td>
                      <td style={tdStyle}>📞 {v.phone}</td>
                      <td style={tdStyle}>{v.skills}</td>
                      <td style={tdStyle}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          color: v.status === 'Activo' ? '#34d399' : v.status === 'Inactivo' ? '#f87171' : '#fbbf24',
                          background: v.status === 'Activo' ? 'rgba(16, 185, 129, 0.1)' : v.status === 'Inactivo' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'
                        }}>{v.status}</span>
                      </td>
                      <td style={{ ...tdStyle, display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button className="btn-primary" onClick={() => startEditVolunteer(v)} style={actionBtnStyle}>✏</button>
                        <button className="btn-secondary" onClick={() => onDeleteVolunteer(v.id)} style={{ ...actionBtnStyle, background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>🗑</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'projects' && (
            <table style={tableStyle}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={thStyle}>Proyecto</th>
                  <th style={thStyle}>ONG Asoc.</th>
                  <th style={thStyle}>Presupuesto</th>
                  <th style={thStyle}>Estado</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                      No hay proyectos registrados en PostgreSQL.
                    </td>
                  </tr>
                ) : (
                  projects.map(p => {
                    const associatedNgo = ngos.find(n => n.id === p.ngoId);
                    return (
                      <tr key={p.id} style={trStyle}>
                        <td style={tdStyle}><b>{p.title}</b></td>
                        <td style={tdStyle}>🏢 {associatedNgo ? associatedNgo.name : `ID: ${p.ngoId}`}</td>
                        <td style={tdStyle}>💵 ${p.budget.toLocaleString()} USD</td>
                        <td style={tdStyle}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            color: p.status === 'Completado' ? '#34d399' : p.status === 'En Progreso' ? '#60a5fa' : '#fbbf24',
                            background: p.status === 'Completado' ? 'rgba(16, 185, 129, 0.1)' : p.status === 'En Progreso' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(245, 158, 11, 0.1)'
                          }}>{p.status}</span>
                        </td>
                        <td style={{ ...tdStyle, display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button className="btn-primary" onClick={() => startEditProject(p)} style={actionBtnStyle}>✏</button>
                          <button className="btn-secondary" onClick={() => onDeleteProject(p.id)} style={{ ...actionBtnStyle, background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>🗑</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
};

// Styling structures for dynamic Admin tables and forms
const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#060913',
  border: '1px solid var(--border-color)',
  borderRadius: '10px',
  padding: '0.75rem',
  color: 'white',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box'
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
  fontSize: '0.9rem',
  color: 'var(--text-primary)'
};

const thStyle: React.CSSProperties = {
  padding: '1rem',
  color: 'var(--text-secondary)',
  fontWeight: 600,
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const trStyle: React.CSSProperties = {
  borderBottom: '1px solid var(--border-color)',
  transition: 'background 0.2s'
};

const tdStyle: React.CSSProperties = {
  padding: '1rem',
  verticalAlign: 'middle'
};

const actionBtnStyle: React.CSSProperties = {
  padding: '0.45rem',
  borderRadius: '8px',
  boxShadow: 'none',
  fontSize: '0.85rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  cursor: 'pointer'
};
