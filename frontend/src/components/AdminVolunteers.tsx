/* LinkONG Admin Volunteers Audit Component */
import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import type { Volunteer } from '../services/adminService';
import { Users, Search, Phone, Mail } from 'lucide-react';

export const AdminVolunteers: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [estadoFilter, setEstadoFilter] = useState('');
  const [habilidadFilter, setHabilidadFilter] = useState('');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const list = await adminService.searchVolunteers(
        estadoFilter || undefined,
        habilidadFilter || undefined
      );
      setVolunteers(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, [estadoFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVolunteers();
  };

  const handleStatusChange = async (id: string, newStatus: 'Activo' | 'Inactivo' | 'En Inducción') => {
    try {
      await adminService.updateVolunteerStatus(id, newStatus);
      setSuccessMsg(`Estado de voluntario actualizado a "${newStatus}" con éxito.`);
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchVolunteers();
    } catch (err: any) {
      alert(err.message || 'Error al cambiar el estado del voluntario');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Title & Context */}
      <div>
        <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Users style={{ color: 'var(--primary)' }} /> Auditoría de Voluntarios Globales
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Filtra habilidades técnicas, gestiona convocatorias y aprueba inducciones de seguridad.</p>
      </div>

      {successMsg && (
        <div className="badge badge-success" style={{ padding: '0.8rem 1.2rem', textTransform: 'none', borderRadius: '8px', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
          {successMsg}
        </div>
      )}

      {/* 🔍 Search and Filters Bar */}
      <form onSubmit={handleSearchSubmit} className="glass-panel" style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '1.25rem',
        flexWrap: 'wrap'
      }}>
        <div className="form-group" style={{ flex: 1, minWidth: '220px', marginBottom: 0 }}>
          <label className="form-label">Buscar por Habilidad Técnica</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: Carpintería, Albañilería, Pintura..."
              value={habilidadFilter}
              onChange={(e) => setHabilidadFilter(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <div className="form-group" style={{ minWidth: '180px', marginBottom: 0 }}>
          <label className="form-label">Filtrar por Estado</label>
          <select
            className="form-control"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option value="">Todos los Estados</option>
            <option value="Activo">Activo (Aprobado)</option>
            <option value="En Inducción">En Inducción (Pendiente)</option>
            <option value="Inactivo">Inactivo (De baja lógica)</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem', height: '42px' }}>
          <Search size={16} /> Buscar
        </button>
      </form>

      {/* 📊 Volunteers Table list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Buscando voluntarios en el sistema...</div>
      ) : volunteers.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          No se encontraron voluntarios registrados que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.9rem'
          }}>
            <thead>
              <tr style={{
                background: 'var(--bg-base)',
                borderBottom: '2px solid var(--border-color)',
                color: 'var(--text-main)',
                fontWeight: 700
              }}>
                <th style={{ padding: '1rem 1.5rem' }}>Nombre Completo</th>
                <th style={{ padding: '1rem 1.5rem' }}>Contacto</th>
                <th style={{ padding: '1rem 1.5rem' }}>Habilidades</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>Talla</th>
                <th style={{ padding: '1rem 1.5rem' }}>Estado Actual</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>Acciones / Auditoría</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((vol) => (
                <tr key={vol.id} style={{
                  borderBottom: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  transition: 'var(--transition-fast)'
                }} className="table-row-hover">
                  
                  {/* Name and Registry Date */}
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{vol.nombreCompleto}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Registrado: {new Date(vol.fechaRegistro).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Contact details */}
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <Mail size={13} style={{ color: 'var(--primary)' }} />
                      <span>{vol.correoElectronico}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      <Phone size={13} style={{ color: 'var(--success)' }} />
                      <span>{vol.telefono}</span>
                    </div>
                  </td>

                  {/* Skills tags */}
                  <td style={{ padding: '1.25rem 1.5rem', maxWidth: '280px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {vol.habilidadesTecnicas.map((h, i) => (
                        <span key={i} className="badge badge-info" style={{
                          fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', textTransform: 'none'
                        }}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* T-Shirt Size */}
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', fontWeight: 600 }}>
                    {vol.tallaCamiseta}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span className={`badge ${
                      vol.estadoVoluntario === 'Activo' ? 'badge-success' :
                      vol.estadoVoluntario === 'En Inducción' ? 'badge-warning' : 'badge-danger'
                    }`} style={{ fontSize: '0.75rem' }}>
                      {vol.estadoVoluntario}
                    </span>
                  </td>

                  {/* Actions status patch */}
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <select
                        className="form-control"
                        value={vol.estadoVoluntario}
                        onChange={(e) => handleStatusChange(vol.id, e.target.value as any)}
                        style={{
                          fontSize: '0.8rem',
                          padding: '0.35rem 0.5rem',
                          width: '140px',
                          boxShadow: 'none',
                          borderRadius: '6px'
                        }}
                      >
                        <option value="Activo">✓ Aprobar Activo</option>
                        <option value="En Inducción">⏳ En Inducción</option>
                        <option value="Inactivo">🚫 Dar de Baja</option>
                      </select>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default AdminVolunteers;
