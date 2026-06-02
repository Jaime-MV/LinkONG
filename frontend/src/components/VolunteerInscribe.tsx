/* LinkONG Volunteer Activity Application Component */
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { volunteerService } from '../services/volunteerService';
import type { SocialProject } from '../services/adminService';
import type { Activity } from '../services/coordinatorService';
import { getMockTable } from '../services/api';
import { Calendar, Check, Send } from 'lucide-react';

export const VolunteerInscribe: React.FC = () => {
  const { user } = useAuth();
  
  const [projects, setProjects] = useState<SocialProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [signups, setSignups] = useState<Record<string, number>>({});
  const [mySignups, setMySignups] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyingActivity, setApplyingActivity] = useState<Activity | null>(null);
  const [preferedRole, setPreferedRole] = useState('Ayudante General');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const list = await volunteerService.getAvailableProjects();
      setProjects(list);
      
      if (list.length > 0) {
        setSelectedProjectId(list[0].id || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Fetch activities when selected campaign changes
  const fetchCampaignActivities = async () => {
    if (!selectedProjectId || !user) return;
    try {
      const openActs = await volunteerService.getOpenActivitiesByProject(selectedProjectId);
      setActivities(openActs);

      // Load spot fill count for each activity
      const assistances = getMockTable('asistencias');
      const signupMap: Record<string, number> = {};
      const mySignupsSet = new Set<string>();

      openActs.forEach((act) => {
        const matches = assistances.filter((a) => a.idActividad === act.id);
        signupMap[act.id || ''] = matches.length;

        // Check if I am already applied
        const amApplied = matches.some((a) => a.idVoluntario === user.id);
        if (amApplied && act.id) {
          mySignupsSet.add(act.id);
        }
      });
      setSignups(signupMap);
      setMySignups(mySignupsSet);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCampaignActivities();
  }, [selectedProjectId, user]);

  const triggerApplyFlow = (act: Activity) => {
    setErrorMsg(null);
    setApplyingActivity(act);
    
    // Autofill preferred role based on volunteer's skills if any
    const volunteerProfile = getMockTable('voluntarios').find((v) => v.id === user?.id);
    if (volunteerProfile && volunteerProfile.habilidadesTecnicas.length > 0) {
      setPreferedRole(volunteerProfile.habilidadesTecnicas[0]);
    } else {
      setPreferedRole('Ayudante General');
    }
    
    setShowApplyModal(true);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    
    if (!user || !applyingActivity || !applyingActivity.id) return;

    try {
      await volunteerService.applyToActivity(applyingActivity.id, user.id, preferedRole);
      setSuccessMsg(`¡Te has postulado con éxito a la jornada "${applyingActivity.tituloActividad}" como "${preferedRole}"!`);
      setShowApplyModal(false);
      fetchCampaignActivities(); // refresh signups
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al postularse');
    }
  };

  const getSelectedProjectName = () => {
    const p = projects.find((x) => x.id === selectedProjectId);
    return p ? p.nombreCampana : '';
  };

  if (loading && projects.length === 0) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando campañas sociales disponibles...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Calendar style={{ color: 'var(--primary)' }} /> Inscripción a Jornadas de Construcción
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Calendario de convocatorias activas. Postúlate a frentes y acumula horas de servicio.</p>
      </div>

      {/* Select Project selector */}
      {projects.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No hay proyectos activos con convocatorias abiertas de voluntariado en este momento.
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label">Seleccione el Frente de Trabajo o Campaña</label>
            <select
              className="form-control"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.nombreCampana} ({p.localidadBeneficiada})</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Message alerts */}
      {successMsg && (
        <div className="badge badge-success" style={{ padding: '0.8rem 1.2rem', textTransform: 'none', borderRadius: '8px', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
          {successMsg}
        </div>
      )}

      {/* Activities Grid */}
      {selectedProjectId && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Jornadas Abiertas en {getSelectedProjectName()}</h3>

          {activities.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No se registran jornadas de campo programadas o con cupos libres para este proyecto.
            </div>
          ) : (
            <div className="grid-2">
              {activities.map((act) => {
                const signupCount = signups[act.id || ''] || 0;
                const amApplied = mySignups.has(act.id || '');
                const pct = Math.min(100, Math.round((signupCount / act.cuposVoluntariosRequeridos) * 100));

                return (
                  <div key={act.id} className="premium-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>{act.tituloActividad}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>{act.descripcionDetalle}</p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '1.25rem' }}>
                        <Calendar size={14} style={{ color: 'var(--primary)' }} />
                        <span>Fecha y Hora: {new Date(act.fechaEjecucion).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Progress & Apply trigger button */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      
                      {/* Quota Progress */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                          <span style={{ color: 'var(--text-muted)' }}>Convocatoria</span>
                          <span>{signupCount} / {act.cuposVoluntariosRequeridos} ({pct}%)</span>
                        </div>
                        <div className="progress-bar-container">
                          <div className="progress-bar" style={{ width: `${pct}%`, background: amApplied ? 'var(--success)' : 'linear-gradient(90deg, var(--primary), var(--info))' }} />
                        </div>
                      </div>

                      {/* Application Buttons */}
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                        {amApplied ? (
                          <div className="badge badge-success" style={{ padding: '0.5rem 1rem', textTransform: 'none', gap: '0.3rem', fontWeight: 600 }}>
                            <Check size={14} /> ¡Ya estás postulado!
                          </div>
                        ) : signupCount >= act.cuposVoluntariosRequeridos ? (
                          <span className="badge badge-danger" style={{ textTransform: 'none', padding: '0.5rem 1rem' }}>Convocatoria Llena</span>
                        ) : (
                          <button onClick={() => triggerApplyFlow(act)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }}>
                            <Send size={14} /> Postularme
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 🧭 APPLICATION DETAILS MODAL */}
      {showApplyModal && applyingActivity && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div className="glass-panel anim-fade-in" style={{
            background: 'var(--bg-surface)', padding: '2rem', width: '100%', maxWidth: '480px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🙋‍♂️ Postulación de Voluntario
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Estás postulándote a: <strong>{applyingActivity.tituloActividad}</strong>
            </p>

            {errorMsg && <div className="badge badge-danger" style={{ display: 'block', padding: '0.5rem', marginBottom: '1rem', textTransform: 'none', textAlign: 'center' }}>{errorMsg}</div>}

            <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Rol Deseado o Habilidad a Desempeñar</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Pintor, Carpintero Auxiliar, Acarreador..."
                  value={preferedRole}
                  onChange={(e) => setPreferedRole(e.target.value)}
                  required
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Especifica qué rol te gustaría tener en la jornada para que el coordinador lo organice en la asistencia.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                  <Check size={16} /> Confirmar Postulación
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
export default VolunteerInscribe;
