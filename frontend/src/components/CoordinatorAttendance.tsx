/* LinkONG Coordinator Attendance Check Sheet Component */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { coordinatorService } from '../services/coordinatorService';
import type { AttendanceRecord } from '../services/coordinatorService';
import { getMockTable } from '../services/api';
import { UserCheck, Save } from 'lucide-react';

export const CoordinatorAttendance: React.FC = () => {
  const { user } = useAuth();
  
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchActivities = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Get all coordinator projects first
      const projList = await coordinatorService.getProjectsByCoordinator(user.id);
      
      // Get all activities matching projects
      const allActs = getMockTable('actividades');
      const projIds = new Set(projList.map((p) => p.id));
      const filteredActs = allActs.filter((a) => projIds.has(a.idProyecto));
      setActivities(filteredActs);

      if (filteredActs.length > 0) {
        setSelectedActivityId(filteredActs[0].id || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [user]);

  // Fetch signups when selected activity changes
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!selectedActivityId) return;
      try {
        const list = await coordinatorService.getApplicants(selectedActivityId);
        setRecords(list);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApplicants();
  }, [selectedActivityId]);

  const handleAttendanceToggle = (index: number) => {
    const updated = [...records];
    updated[index].asistio = !updated[index].asistio;
    // Pre-fill default hours (e.g. 8 hours) if checked, or clear to 0 if unchecked
    if (updated[index].asistio && updated[index].horasTrabajadas === 0) {
      updated[index].horasTrabajadas = 8.0;
    } else if (!updated[index].asistio) {
      updated[index].horasTrabajadas = 0.0;
    }
    setRecords(updated);
  };

  const handleHoursChange = (index: number, val: number) => {
    const updated = [...records];
    updated[index].horasTrabajadas = Math.max(0, val);
    setRecords(updated);
  };

  const handleRolChange = (index: number, val: string) => {
    const updated = [...records];
    updated[index].rolEnActividad = val;
    setRecords(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate that hours are logical
    const invalidRecord = records.find(r => r.asistio && r.horasTrabajadas <= 0);
    if (invalidRecord) {
      setErrorMsg(`El voluntario ${invalidRecord.nombreVoluntario} tiene marcado 'asistió' pero registra 0 horas.`);
      return;
    }

    try {
      await coordinatorService.saveAttendance(selectedActivityId, records);
      setSuccessMsg('Asistencias y horas acreditadas con éxito. Se cerró la jornada en el sistema.');
      setTimeout(() => setSuccessMsg(null), 4000);
      fetchActivities(); // refresh lists to update activity states
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar asistencia');
    }
  };

  if (loading && activities.length === 0) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando hojas de control de asistencia...</div>;
  }

  // Get selected activity object
  const activeActivity = activities.find((a) => a.id === selectedActivityId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <UserCheck style={{ color: 'var(--primary)' }} /> Control de Asistencia y Trazabilidad
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Cierre de Jornada: Acredita asistencia y horas logradas a tus voluntarios postulados.</p>
      </div>

      {/* Select Activity Selector */}
      {activities.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No se registran actividades programadas en tus frentes para marcar asistencia.
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label">Seleccione la Actividad / Jornada Operativa</label>
            <select
              className="form-control"
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
            >
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.tituloActividad} ({a.estado}) — {new Date(a.fechaEjecucion).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {activeActivity && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.85rem' }}>
              <span><strong>Estado de la Jornada:</strong> <span className="badge badge-info">{activeActivity.estado}</span></span>
              <span><strong>Total Postulados:</strong> {records.length} voluntarios</span>
            </div>
          )}
        </div>
      )}

      {/* Warning and Success alarms */}
      {successMsg && (
        <div className="badge badge-success" style={{ padding: '0.8rem 1.2rem', textTransform: 'none', borderRadius: '8px', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="badge badge-danger" style={{ padding: '0.8rem 1.2rem', textTransform: 'none', borderRadius: '8px', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
          {errorMsg}
        </div>
      )}

      {/* Attendance Grid Sheet */}
      {selectedActivityId && (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {records.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No se han postulado voluntarios a esta actividad. No es posible cargar asistencias.
            </div>
          ) : (
            <div className="glass-panel" style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
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
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'center', width: '100px' }}>Asistió</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Nombre del Voluntario</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Rol Asignado en Jornada</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'center', width: '160px' }}>Horas Trabajadas</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, i) => (
                    <tr key={rec.idVoluntario} style={{
                      borderBottom: '1px solid var(--border-color)',
                      background: rec.asistio ? 'hsla(142, 76%, 36%, 0.03)' : 'var(--bg-surface)',
                      transition: 'var(--transition-fast)'
                    }}>
                      
                      {/* Checkbox */}
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={rec.asistio}
                          onChange={() => handleAttendanceToggle(i)}
                          style={{
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                            accentColor: 'var(--success)'
                          }}
                        />
                      </td>

                      {/* Name */}
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>
                        {rec.nombreVoluntario}
                      </td>

                      {/* Role input field */}
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <input
                          type="text"
                          className="form-control"
                          value={rec.rolEnActividad}
                          onChange={(e) => handleRolChange(i, e.target.value)}
                          placeholder="Ej: Acarreador, Carpintero..."
                          disabled={!rec.asistio}
                          style={{
                            fontSize: '0.85rem',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            background: rec.asistio ? 'var(--bg-surface)' : 'var(--bg-base)'
                          }}
                          required={rec.asistio}
                        />
                      </td>

                      {/* Hours worked input field */}
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <input
                            type="number"
                            className="form-control"
                            step="0.5"
                            value={rec.horasTrabajadas === 0 ? '' : rec.horasTrabajadas}
                            onChange={(e) => handleHoursChange(i, Number(e.target.value))}
                            placeholder="0"
                            disabled={!rec.asistio}
                            style={{
                              fontSize: '0.85rem',
                              padding: '0.4rem 0.5rem',
                              width: '80px',
                              textAlign: 'center',
                              borderRadius: '6px',
                              background: rec.asistio ? 'var(--bg-surface)' : 'var(--bg-base)'
                            }}
                            required={rec.asistio}
                          />
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>hrs</span>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {records.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                <Save size={18} /> Guardar Asistencia y Cerrar Jornada
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
export default CoordinatorAttendance;
