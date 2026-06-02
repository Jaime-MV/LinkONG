/* LinkONG Admin Projects CRUD Component */
import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import type { SocialProject } from '../services/adminService';
import { getMockTable } from '../services/api';
import { Briefcase, Plus, Edit2, Trash2, Calendar, MapPin, Layers } from 'lucide-react';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<SocialProject[]>([]);
  const [coordinators, setCoordinators] = useState<Array<{ id: string; nombre: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<SocialProject>({
    nombreCampana: '',
    descripcionObjetivo: '',
    localidadBeneficiada: '',
    fechaInicio: '',
    fechaFinEstimada: '',
    idCoordinadorResponsable: '',
    estadoProyecto: 'En Diagnóstico'
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const list = await adminService.getProjects();
      setProjects(list);

      // Load coordinators from local mock database (to populate select dropdown)
      const coords = getMockTable('coordinadores').filter((c) => c.rol === 'Coordinador');
      setCoordinators(coords);

      if (coords.length > 0 && !form.idCoordinadorResponsable) {
        setForm((f) => ({ ...f, idCoordinadorResponsable: coords[0].id }));
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm({
      nombreCampana: '',
      descripcionObjetivo: '',
      localidadBeneficiada: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFinEstimada: new Date().toISOString().split('T')[0],
      idCoordinadorResponsable: coordinators[0]?.id || '',
      estadoProyecto: 'En Diagnóstico'
    });
    setErrorMsg(null);
    setShowModal(true);
  };

  const openEditModal = (proj: SocialProject) => {
    setIsEdit(true);
    setEditingId(proj.id || null);
    setForm({
      nombreCampana: proj.nombreCampana,
      descripcionObjetivo: proj.descripcionObjetivo,
      localidadBeneficiada: proj.localidadBeneficiada,
      fechaInicio: proj.fechaInicio,
      fechaFinEstimada: proj.fechaFinEstimada,
      idCoordinadorResponsable: proj.idCoordinadorResponsable,
      estadoProyecto: proj.estadoProyecto
    });
    setErrorMsg(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (new Date(form.fechaFinEstimada) < new Date(form.fechaInicio)) {
      setErrorMsg('La fecha de fin estimada no puede ser anterior a la fecha de inicio.');
      return;
    }

    try {
      if (isEdit && editingId) {
        await adminService.updateProject(editingId, form);
        setSuccessMsg('Campaña habitacional actualizada con éxito.');
      } else {
        await adminService.createProject(form);
        setSuccessMsg('Nueva campaña habitacional creada con éxito.');
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar proyecto');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de que desea eliminar permanentemente este proyecto? Se validará que no tenga transacciones previas.')) {
      return;
    }
    
    try {
      await adminService.deleteProject(id);
      setSuccessMsg('Proyecto eliminado del sistema.');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar el proyecto');
    }
  };

  // Helper to map Coordinator Name
  const getCoordinatorName = (id: string) => {
    const found = coordinators.find((c) => c.id === id);
    return found ? found.nombre : 'Sin asignar o Coordinador Especial';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Title & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Briefcase style={{ color: 'var(--primary)' }} /> Gestión de Campañas Sociales
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Crea, edita o cancela proyectos de construcción de viviendas en toda la fundación.</p>
        </div>
        
        <button onClick={openCreateModal} className="btn btn-primary" style={{ gap: '0.4rem' }}>
          <Plus size={18} /> Nueva Campaña
        </button>
      </div>

      {successMsg && (
        <div className="badge badge-success" style={{ padding: '0.8rem 1.2rem', textTransform: 'none', borderRadius: '8px', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
          {successMsg}
        </div>
      )}

      {loading && projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando campañas habitacionales...</div>
      ) : projects.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <p>No se encontraron campañas sociales activas.</p>
          <button onClick={openCreateModal} className="btn btn-secondary" style={{ marginTop: '1rem' }}>Crear Primera Campaña</button>
        </div>
      ) : (
        /* 📂 Campaigns Grid */
        <div className="grid-2">
          {projects.map((proj) => (
            <div key={proj.id} className="premium-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>
              <div>
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                  <span className={`badge ${
                    proj.estadoProyecto === 'Finalizado' ? 'badge-success' :
                    proj.estadoProyecto === 'En Ejecución' ? 'badge-primary' :
                    proj.estadoProyecto === 'En Recaudación' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {proj.estadoProyecto}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEditModal(proj)} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '6px' }} title="Editar">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(proj.id!)} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--danger)' }} title="Eliminar">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 800 }}>{proj.nombreCampana}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {proj.descripcionObjetivo}
                </p>

                {/* Details list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={15} style={{ color: 'var(--primary)' }} />
                    <span><strong>Localidad:</strong> {proj.localidadBeneficiada}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={15} style={{ color: 'var(--info)' }} />
                    <span><strong>Periodo:</strong> {proj.fechaInicio} al {proj.fechaFinEstimada}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={15} style={{ color: 'var(--warning)' }} />
                    <span><strong>Coordinador Responsable:</strong> {getCoordinatorName(proj.idCoordinadorResponsable)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🧭 CREATE/EDIT PROJECT MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
        }}>
          <div className="glass-panel anim-fade-in" style={{
            background: 'var(--bg-surface)', padding: '2.5rem', width: '100%', maxWidth: '640px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🏠 {isEdit ? 'Editar Campaña Habitacional' : 'Nueva Campaña Habitacional'}
            </h3>

            {errorMsg && <div className="badge badge-danger" style={{ display: 'block', padding: '0.5rem', marginBottom: '1rem', textTransform: 'none', textAlign: 'center' }}>{errorMsg}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="form-group">
                <label className="form-label">Nombre de la Campaña</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Comunidad El Espino II"
                  value={form.nombreCampana}
                  onChange={(e) => setForm(f => ({ ...f, nombreCampana: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Objetivo y Descripción Detallada</label>
                <textarea
                  className="form-control"
                  placeholder="Describa el objetivo social, número de viviendas a construir..."
                  rows={3}
                  value={form.descripcionObjetivo}
                  onChange={(e) => setForm(f => ({ ...f, descripcionObjetivo: e.target.value }))}
                  required
                />
              </div>

              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Localidad / Municipio</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Santa Tecla Centro"
                    value={form.localidadBeneficiada}
                    onChange={(e) => setForm(f => ({ ...f, localidadBeneficiada: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estado de la Campaña</label>
                  <select
                    className="form-control"
                    value={form.estadoProyecto}
                    onChange={(e) => setForm(f => ({ ...f, estadoProyecto: e.target.value as any }))}
                  >
                    <option value="En Diagnóstico">En Diagnóstico</option>
                    <option value="En Recaudación">En Recaudación</option>
                    <option value="En Ejecución">En Ejecución</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
              </div>

              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Fecha de Inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.fechaInicio}
                    onChange={(e) => setForm(f => ({ ...f, fechaInicio: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha de Fin Estimada</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.fechaFinEstimada}
                    onChange={(e) => setForm(f => ({ ...f, fechaFinEstimada: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Coordinador Responsable (Líder Campo)</label>
                <select
                  className="form-control"
                  value={form.idCoordinadorResponsable}
                  onChange={(e) => setForm(f => ({ ...f, idCoordinadorResponsable: e.target.value }))}
                  required
                >
                  {coordinators.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">{isEdit ? 'Actualizar Campaña' : 'Crear Campaña'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminProjects;
