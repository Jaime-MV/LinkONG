/* LinkONG Coordinator Activities Planner Component */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { coordinatorService } from '../services/coordinatorService';
import type { Activity } from '../services/coordinatorService';
import type { SocialProject } from '../services/adminService';
import { getMockTable } from '../services/api';
import { Calendar, Plus, Edit2, Trash2, Users } from 'lucide-react';

export const CoordinatorActivities: React.FC = () => {
  const { user } = useAuth();
  
  const [projects, setProjects] = useState<SocialProject[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Signups counts (to compute spots filling progress bar)
  const [signups, setSignups] = useState<Record<string, number>>({});

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Activity>({
    idProyecto: '',
    tituloActividad: '',
    descripcionDetalle: '',
    fechaEjecucion: '',
    cuposVoluntariosRequeridos: 10
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const projList = await coordinatorService.getProjectsByCoordinator(user.id);
      setProjects(projList);

      const allActivities = getMockTable('actividades');
      // Filter activities whose project belongs to this coordinator
      const projIds = new Set(projList.map((p) => p.id));
      const filteredActs = allActivities.filter((a) => projIds.has(a.idProyecto));
      setActivities(filteredActs);

      // Load counts of volunteer registrations
      const assistances = getMockTable('asistencias');
      const signupMap: Record<string, number> = {};
      filteredActs.forEach((act) => {
        const count = assistances.filter((a) => a.idActividad === act.id).length;
        signupMap[act.id || ''] = count;
      });
      setSignups(signupMap);

      if (projList.length > 0 && !form.idProyecto) {
        setForm((f) => ({ ...f, idProyecto: projList[0].id || '' }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const openCreateModal = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm({
      idProyecto: projects[0]?.id || '',
      tituloActividad: '',
      descripcionDetalle: '',
      fechaEjecucion: new Date().toISOString().substring(0, 16), // datetime-local format
      cuposVoluntariosRequeridos: 10
    });
    setErrorMsg(null);
    setShowModal(true);
  };

  const openEditModal = (act: Activity) => {
    setIsEdit(true);
    setEditingId(act.id || null);
    setForm({
      idProyecto: act.idProyecto,
      tituloActividad: act.tituloActividad,
      descripcionDetalle: act.descripcionDetalle || '',
      fechaEjecucion: new Date(act.fechaEjecucion).toISOString().substring(0, 16),
      cuposVoluntariosRequeridos: act.cuposVoluntariosRequeridos
    });
    setErrorMsg(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (form.cuposVoluntariosRequeridos <= 0) {
      setErrorMsg('Los cupos de voluntarios requeridos deben ser mayores a cero.');
      return;
    }

    try {
      const formattedForm = {
        ...form,
        fechaEjecucion: new Date(form.fechaEjecucion).toISOString()
      };

      if (isEdit && editingId) {
        await coordinatorService.updateActivity(editingId, formattedForm);
        setSuccessMsg('Actividad de campo actualizada con éxito.');
      } else {
        await coordinatorService.createActivity(formattedForm);
        setSuccessMsg('Nueva actividad de campo programada y publicada.');
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar actividad');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de que desea cancelar y eliminar esta jornada de trabajo?')) {
      return;
    }
    try {
      await coordinatorService.deleteActivity(id);
      setSuccessMsg('Actividad cancelada y eliminada.');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar actividad');
    }
  };

  // Helper to map project name
  const getProjectName = (id: string) => {
    const found = projects.find((p) => p.id === id);
    return found ? found.nombreCampana : 'Proyecto Habitacional';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Title & Context */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Calendar style={{ color: 'var(--primary)' }} /> Planificación de Jornadas Operativas
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Programa actividades los fines de semana, ajusta los cupos de convocatoria y describe los roles requeridos.</p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary" style={{ gap: '0.4rem' }}>
          <Plus size={18} /> Programar Actividad
        </button>
      </div>

      {successMsg && (
        <div className="badge badge-success" style={{ padding: '0.8rem 1.2rem', textTransform: 'none', borderRadius: '8px', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
          {successMsg}
        </div>
      )}

      {loading && activities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando calendario operativo...</div>
      ) : activities.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <p>No has programado actividades operativas aún.</p>
          <button onClick={openCreateModal} className="btn btn-secondary" style={{ marginTop: '1rem' }}>Programar Primera Actividad</button>
        </div>
      ) : (
        /* 📅 Activities List */
        <div className="grid-2">
          {activities.map((act) => {
            const signupCount = signups[act.id || ''] || 0;
            const pct = Math.min(100, Math.round((signupCount / act.cuposVoluntariosRequeridos) * 100));
            return (
              <div key={act.id} className="premium-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}>
                <div>
                  
                  {/* Status & Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className={`badge ${
                      act.estado === 'Ejecutada' ? 'badge-success' :
                      act.estado === 'Confirmada' ? 'badge-primary' :
                      act.estado === 'Cancelada' ? 'badge-danger' : 'badge-info'
                    }`} style={{ fontSize: '0.7rem' }}>
                      {act.estado}
                    </span>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {act.estado !== 'Ejecutada' && (
                        <button onClick={() => openEditModal(act)} className="btn btn-secondary" style={{ padding: '0.35rem', borderRadius: '6px' }} title="Editar">
                          <Edit2 size={13} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(act.id!)} className="btn btn-secondary" style={{ padding: '0.35rem', borderRadius: '6px', color: 'var(--danger)' }} title="Eliminar">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{act.tituloActividad}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600 }}>
                    {getProjectName(act.idProyecto)}
                  </div>
                  
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    {act.descripcionDetalle || 'Sin descripción o instrucciones adicionales cargadas.'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '1.25rem' }}>
                    <Calendar size={14} style={{ color: 'var(--primary)' }} />
                    <span>Jornada: {new Date(act.fechaEjecucion).toLocaleString()}</span>
                  </div>
                </div>

                {/* 🧩 Web Part: Cupos Progress Bar Widget */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
                      <Users size={13} /> Postulados a Convocatoria
                    </span>
                    <span style={{ color: pct >= 80 ? 'var(--success)' : 'var(--primary)' }}>
                      {signupCount} / {act.cuposVoluntariosRequeridos} ({pct}%)
                    </span>
                  </div>
                  
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ 
                      width: `${pct}%`, 
                      background: pct >= 80 ? 'var(--success)' : 'linear-gradient(90deg, var(--primary), var(--info))' 
                    }} />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 🧭 CREATE/EDIT DIALOG */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
        }}>
          <div className="glass-panel anim-fade-in" style={{
            background: 'var(--bg-surface)', padding: '2.5rem', width: '100%', maxWidth: '560px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📅 {isEdit ? 'Editar Jornada de Campo' : 'Programar Nueva Jornada de Campo'}
            </h3>

            {errorMsg && <div className="badge badge-danger" style={{ display: 'block', padding: '0.5rem', marginBottom: '1rem', textTransform: 'none', textAlign: 'center' }}>{errorMsg}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Proyecto / Frente Asociado</label>
                <select
                  className="form-control"
                  value={form.idProyecto}
                  onChange={(e) => setForm(f => ({ ...f, idProyecto: e.target.value }))}
                  required
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombreCampana}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Título de la Actividad</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Jornada de Techado e Hidratación"
                  value={form.tituloActividad}
                  onChange={(e) => setForm(f => ({ ...f, tituloActividad: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Instrucciones y Detalles de Logística</label>
                <textarea
                  className="form-control"
                  placeholder="Ej: Calzar botas punta de acero. Traer herramientas manuales de ser posible..."
                  rows={3}
                  value={form.descripcionDetalle}
                  onChange={(e) => setForm(f => ({ ...f, descripcionDetalle: e.target.value }))}
                  required
                />
              </div>

              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Fecha y Hora de la Convocatoria</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={form.fechaEjecucion}
                    onChange={(e) => setForm(f => ({ ...f, fechaEjecucion: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cupos Requeridos (Voluntarios)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="15"
                    value={form.cuposVoluntariosRequeridos === 0 ? '' : form.cuposVoluntariosRequeridos}
                    onChange={(e) => setForm(f => ({ ...f, cuposVoluntariosRequeridos: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">{isEdit ? 'Actualizar Jornada' : 'Publicar Jornada'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default CoordinatorActivities;
