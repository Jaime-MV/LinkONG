/* LinkONG Volunteer Social Billboard Component */
import React, { useState, useEffect } from 'react';
import { volunteerService } from '../services/volunteerService';
import type { SocialProject } from '../services/adminService';
import { Search, MapPin, Calendar, Compass } from 'lucide-react';

export const VolunteerBillboard: React.FC = () => {
  const [projects, setProjects] = useState<SocialProject[]>([]);
  const [localidad, setLocalidad] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const list = await volunteerService.getAvailableProjects(localidad || undefined);
      setProjects(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [localidad]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Compass style={{ color: 'var(--primary)' }} /> Cartelera Social de Proyectos
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Explora los frentes activos de la fundación LinkONG y descubre dónde estamos construyendo hogares.</p>
      </div>

      {/* Localidad Search Input Card */}
      <form onSubmit={(e) => { e.preventDefault(); fetchProjects(); }} className="glass-panel" style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '1.25rem',
        flexWrap: 'wrap'
      }}>
        <div className="form-group" style={{ flex: 1, minWidth: '220px', marginBottom: 0 }}>
          <label className="form-label">Buscar Proyectos por Localidad o Cercanía</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: Santa Ana, San Salvador, El Espino..."
              value={localidad}
              onChange={(e) => setLocalidad(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem', height: '42px' }}>
          <Search size={16} /> Filtrar Localidad
        </button>
      </form>

      {/* Projects Billboard List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando cartelera de proyectos...</div>
      ) : projects.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          No se encontraron proyectos activos en la localidad especificada.
        </div>
      ) : (
        <div className="grid-2">
          {projects.map((proj) => (
            <div key={proj.id} className="premium-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-success">{proj.estadoProyecto}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                    <MapPin size={14} style={{ color: 'var(--primary)' }} /> {proj.localidadBeneficiada}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{proj.nombreCampana}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{proj.descripcionObjetivo}</p>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Calendar size={14} /> <span><strong>Fecha Estimada:</strong> {proj.fechaInicio} al {proj.fechaFinEstimada}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  ¡Entra en "Inscripción Actividades" para postularte!
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
export default VolunteerBillboard;
