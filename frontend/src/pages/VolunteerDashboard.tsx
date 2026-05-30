import { useState, useEffect } from 'react';
import { DashboardShell } from '../components/DashboardShell';
import { HoursCounterWebPart } from '../components/webparts/HoursCounterWebPart';
import { RecentActivityWebPart } from '../components/webparts/RecentActivityWebPart';
import { useAuth } from '../context/AuthContext';

interface Project {
  idProyecto: string;
  nombreCampana: string;
  descripcionObjetivo: string;
  localidadBeneficiada: string;
  fechaInicio: string;
  fechaFinEstimada: string;
  estadoProyecto: string;
}

interface Activity {
  idActividad: string;
  idProyecto: string;
  tituloActividad: string;
  descripcionDetalle: string;
  fechaEjecucion: string;
  cuposVoluntariosRequeridos: number;
  estado: string;
}

interface ServiceHistoryItem {
  asistencia_id: string;
  asistio: boolean;
  horas: number;
  rol: string;
  nombre_actividad: string;
  fecha_ejecucion: string;
  nombre_proyecto: string;
}

export function VolunteerDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('cartelera');
  
  // Projects & activities
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchLocality, setSearchLocality] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [history, setHistory] = useState<ServiceHistoryItem[]>([]);

  // Profile fields state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSkills, setProfileSkills] = useState('');
  const [profileShirtSize, setProfileShirtSize] = useState('M');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Status message
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);

  const triggerFeedback = (message: string, type: 'success' | 'danger' | 'info' = 'info') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 5000);
  };

  const fetchProjects = async (locality = '') => {
    try {
      let url = '/api/v1/voluntario/proyectos/disponibles';
      if (locality) url += `?localidad=${encodeURIComponent(locality)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActivitiesForProject = async (projId: string) => {
    if (!projId) return;
    try {
      const res = await fetch(`/api/v1/voluntario/proyectos/${projId}/actividades-abiertas`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/v1/voluntario/perfil/actividad-reciente', {
        headers: { 'X-Volunteer-Id': user.id }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchHistory();
  }, [user]);

  // Load activities when active project changes
  useEffect(() => {
    if (selectedProjectId) {
      fetchActivitiesForProject(selectedProjectId);
    } else {
      setActivities([]);
    }
  }, [selectedProjectId]);

  const handlePostular = async (actId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/v1/voluntario/actividades/${actId}/postular`, {
        method: 'POST',
        headers: {
          'X-Volunteer-Id': user.id
        }
      });

      if (res.ok) {
        triggerFeedback('¡Te has postulado con éxito a la jornada!', 'success');
        // Reload activities & stats
        if (selectedProjectId) fetchActivitiesForProject(selectedProjectId);
        fetchHistory();
        window.dispatchEvent(new Event('reload-volunteer'));
      } else {
        const err = await res.json().catch(() => ({ error: 'No se pudo realizar la postulación' }));
        // E.g. "Para postularse a frentes de campo, debe ser un voluntario 'Activo'"
        triggerFeedback(err.error || err.message || 'Error al postularse', 'danger');
      }
    } catch (err) {
      console.error(err);
      triggerFeedback('Error de conexión con el servidor', 'danger');
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      const skillsArray = profileSkills.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        nombreCompleto: profileName,
        telefono: profilePhone,
        habilidadesTecnicas: skillsArray,
        tallaCamiseta: profileShirtSize,
        // Backend models need some default validations
        correoElectronico: user.email,
        fechaNacimiento: '1995-01-01' // placeholder for validation
      };

      const res = await fetch('/api/v1/voluntario/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Volunteer-Id': user.id
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        triggerFeedback('Perfil actualizado correctamente', 'success');
        setShowProfileModal(false);
        // We could refresh state if name changed
      } else {
        const err = await res.json().catch(() => ({ error: 'Error al actualizar perfil' }));
        triggerFeedback(err.error || 'Campos inválidos. Verifica tu teléfono (mín. 7 dígitos).', 'danger');
      }
    } catch (err) {
      console.error(err);
      triggerFeedback('Error de conexión', 'danger');
    }
  };

  const handleOpenProfileModal = () => {
    setProfileName(user?.name || '');
    setProfilePhone('');
    setProfileSkills('');
    setProfileShirtSize('M');
    setShowProfileModal(true);
  };

  return (
    <DashboardShell
      navItems={[
        { id: 'cartelera', icon: '🌍', label: 'Cartelera Social' },
        { id: 'inscripcion', icon: '✍️', label: 'Inscripción a Jornadas' },
        { id: 'historial', icon: '⭐', label: 'Historial de Servicio' }
      ]}
      activeSection={activeSection}
      onNav={setActiveSection}
      pageTitle="Portal del Voluntario"
      pageSubtitle="Descubre proyectos y postúlate"
      roleColor="var(--success)"
      extraHeaderContent={
        <button className="btn btn-secondary btn-sm" onClick={handleOpenProfileModal}>
          ⚙️ Editar Perfil
        </button>
      }
    >
      {feedback && (
        <div className={`alert alert-${feedback.type} mb-3`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{feedback.message}</span>
          <button style={{ background: 'transparent', color: 'inherit', fontWeight: 'bold' }} onClick={() => setFeedback(null)}>×</button>
        </div>
      )}

      <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div>
          {activeSection === 'cartelera' && (
            <div className="fade-in card">
              <h3 className="section-title mb-2">Cartelera Social Activa</h3>
              
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="🔍 Filtrar proyectos por localidad..." 
                  value={searchLocality}
                  onChange={(e) => setSearchLocality(e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => fetchProjects(searchLocality)}>Filtrar</button>
              </div>

              {projects.length === 0 ? (
                <p className="text-sm text-muted">No se encontraron proyectos disponibles en esta área.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {projects.map(p => (
                    <div key={p.idProyecto} className="card" style={{ borderLeft: '4px solid var(--success)', background: 'var(--bg-card)' }}>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold">{p.nombreCampana}</h4>
                        <span className="badge badge-success">{p.localidadBeneficiada}</span>
                      </div>
                      <p className="text-sm text-secondary mb-3">{p.descripcionObjetivo}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted">Fase: {p.estadoProyecto}</span>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => {
                            setSelectedProjectId(p.idProyecto);
                            setActiveSection('inscripcion');
                          }}
                        >
                          Ver jornadas disponibles →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'inscripcion' && (
            <div className="fade-in card">
              <h3 className="section-title mb-2">Inscripción a Jornadas</h3>
              <p className="text-sm text-muted mb-3">Elige un proyecto para visualizar y postularte a sus frentes de campo abiertos.</p>
              
              <div className="form-group mb-3">
                <label className="form-label">Seleccionar Proyecto</label>
                <select className="form-control" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
                  <option value="">-- Elige Proyecto --</option>
                  {projects.map(p => (
                    <option key={p.idProyecto} value={p.idProyecto}>{p.nombreCampana} ({p.localidadBeneficiada})</option>
                  ))}
                </select>
              </div>

              {selectedProjectId && (
                <div className="fade-in">
                  <h4 className="font-bold text-sm mb-2 text-muted">Jornadas Abiertas</h4>
                  {activities.length === 0 ? (
                    <div className="alert alert-info">
                      No hay frentes de obra abiertos con cupos disponibles para este proyecto.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {activities.map(act => (
                        <div key={act.idActividad} className="card p-3 mb-2" style={{ background: 'var(--bg-card2)' }}>
                          <div className="flex justify-between items-center mb-1">
                            <h5 className="font-bold">{act.tituloActividad}</h5>
                            <span className="badge badge-orange">Cupos Libres</span>
                          </div>
                          <p className="text-xs text-secondary mb-2">{act.descripcionDetalle || 'Apoya al equipo en las labores del campo.'}</p>
                          <div className="flex justify-between items-center text-xs text-muted mb-2">
                            <span>Fecha: {act.fechaEjecucion.split('T')[0]}</span>
                            <span>Capacidad: {act.cuposVoluntariosRequeridos} personas</span>
                          </div>
                          <button className="btn btn-primary btn-sm btn-full" onClick={() => handlePostular(act.idActividad)}>
                            Postularse a Jornada
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeSection === 'historial' && (
            <div className="fade-in card">
              <h3 className="section-title mb-2">Historial de Servicio</h3>
              <p className="text-sm text-muted mb-3">Resumen de tus jornadas completadas y horas de impacto cargadas.</p>
              
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Jornada</th>
                      <th>Campaña</th>
                      <th>Fecha</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Horas Acreditadas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center' }} className="text-muted">
                          No tienes registros en tu historial de servicio todavía.
                        </td>
                      </tr>
                    ) : (
                      history.map(item => (
                        <tr key={item.asistencia_id}>
                          <td className="font-bold">{item.nombre_actividad}</td>
                          <td>{item.nombre_proyecto || 'LinkONG'}</td>
                          <td className="text-xs">{item.fecha_ejecucion ? item.fecha_ejecucion.split('T')[0] : 'N/A'}</td>
                          <td>{item.rol}</td>
                          <td>
                            <span className={`badge ${item.asistio ? 'badge-success' : 'badge-warning'}`}>
                              {item.asistio ? 'Completada' : 'Inscrito'}
                            </span>
                          </td>
                          <td className={`font-bold ${item.asistio ? 'text-success' : 'text-muted'}`}>
                            {item.asistio ? `+${item.horas} hrs` : '--'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div>
          <HoursCounterWebPart />
          <RecentActivityWebPart />
        </div>
      </div>

      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Actualizar Perfil de Voluntario</h3>
            
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <input type="text" className="form-control" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono (Mín. 7 dígitos)</label>
              <input type="text" className="form-control" placeholder="Ej: 555-1234" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Habilidades (separadas por coma)</label>
              <input type="text" className="form-control" placeholder="Ej: Albañilería, Pintura, Logística" value={profileSkills} onChange={(e) => setProfileSkills(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Talla de Camiseta</label>
              <select className="form-control" value={profileShirtSize} onChange={(e) => setProfileShirtSize(e.target.value)}>
                <option value="S">S (Small)</option>
                <option value="M">M (Medium)</option>
                <option value="L">L (Large)</option>
                <option value="XL">XL (Extra Large)</option>
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleUpdateProfile}>Guardar Perfil</button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
