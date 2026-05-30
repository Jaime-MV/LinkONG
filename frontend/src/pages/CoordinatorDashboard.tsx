import { useState, useEffect } from 'react';
import { DashboardShell } from '../components/DashboardShell';
import { ConvocationStatusWebPart } from '../components/webparts/ConvocationStatusWebPart';
import { AlertsWebPart } from '../components/webparts/AlertsWebPart';
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

interface ProjectBalance {
  proyecto_id: string;
  nombre_proyecto: string;
  donaciones_totales: number;
  gastos_totales: number;
  balance_local: number;
}

interface Activity {
  idActividad?: string;
  idProyecto: string;
  tituloActividad: string;
  descripcionDetalle: string;
  fechaEjecucion: string;
  cuposVoluntariosRequeridos: number;
  estado: 'Programada' | 'Confirmada' | 'Ejecutada' | 'Cancelada';
}

interface VolunteerAttendance {
  id_voluntario: string;
  nombre_voluntario: string;
  correo_voluntario: string;
  rol: string;
  asistio: boolean;
  horas_acreditadas: number;
}

interface PostuladosResponse {
  actividad_id: string;
  titulo_actividad: string;
  cupos_totales: number;
  anotados_count: number;
  postulados: VolunteerAttendance[];
}

export function CoordinatorDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('mis-proyectos');
  const [projects, setProjects] = useState<Project[]>([]);
  const [balances, setBalances] = useState<Record<string, ProjectBalance>>({});
  const [activities, setActivities] = useState<Record<string, Activity[]>>({});
  
  // Selection states
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const [selectedActivityEnrollment, setSelectedActivityEnrollment] = useState<PostuladosResponse | null>(null);

  // New activity form
  const [actTitle, setActTitle] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [actDate, setActDate] = useState('');
  const [actSlots, setActSlots] = useState('5');
  const [actStatus, setActStatus] = useState<'Programada' | 'Confirmada'>('Programada');

  // Attendance state
  const [attendanceList, setAttendanceList] = useState<VolunteerAttendance[]>([]);

  // Status message
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);

  const triggerFeedback = (message: string, type: 'success' | 'danger' | 'info' = 'info') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 5000);
  };

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/v1/coordinador/mis-proyectos', {
        headers: { 'X-Coordinator-Id': user.id }
      });
      if (res.ok) {
        const projData = await res.json() as Project[];
        setProjects(projData);

        // Fetch balances and activities for each project
        const balanceMap: Record<string, ProjectBalance> = {};
        const activityMap: Record<string, Activity[]> = {};

        for (const p of projData) {
          const balRes = await fetch(`/api/v1/coordinador/proyectos/${p.idProyecto}/balance-local`);
          if (balRes.ok) {
            balanceMap[p.idProyecto] = await balRes.json();
          }

          const actRes = await fetch(`/api/v1/coordinador/proyectos/${p.idProyecto}/actividades`);
          if (actRes.ok) {
            activityMap[p.idProyecto] = await actRes.json();
          }
        }
        
        setBalances(balanceMap);
        setActivities(activityMap);

        if (projData.length > 0) {
          setSelectedProjectId(projData[0].idProyecto);
        }
      }
    } catch (err) {
      console.error(err);
      triggerFeedback('Error de conexión con el servidor', 'danger');
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // Handle enrollment status loading for the selected activity
  const handleLoadActivityEnrollment = async (actId: string) => {
    try {
      const res = await fetch(`/api/v1/coordinador/actividades/${actId}/postulados`);
      if (res.ok) {
        const data = await res.json() as PostuladosResponse;
        setSelectedActivityEnrollment(data);
        setAttendanceList(data.postulados || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedActivityId) {
      handleLoadActivityEnrollment(selectedActivityId);
    } else {
      setSelectedActivityEnrollment(null);
      setAttendanceList([]);
    }
  }, [selectedActivityId]);

  const handleProgramActivity = async () => {
    if (!selectedProjectId) {
      triggerFeedback('Debes seleccionar un proyecto', 'danger');
      return;
    }
    if (!actTitle || !actDate || !actSlots) {
      triggerFeedback('Todos los campos son requeridos', 'danger');
      return;
    }

    try {
      const payload: Activity = {
        idProyecto: selectedProjectId,
        tituloActividad: actTitle,
        descripcionDetalle: actDesc,
        fechaEjecucion: new Date(actDate).toISOString(),
        cuposVoluntariosRequeridos: parseInt(actSlots),
        estado: actStatus
      };

      const res = await fetch(`/api/v1/coordinador/proyectos/${selectedProjectId}/actividades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        triggerFeedback('Actividad programada con éxito', 'success');
        setActTitle('');
        setActDesc('');
        setActDate('');
        setActSlots('5');
        // Reload
        loadDashboardData();
        window.dispatchEvent(new Event('reload-alerts'));
      } else {
        const err = await res.json().catch(() => ({ error: 'Error al programar actividad' }));
        triggerFeedback(err.error || 'Error del servidor', 'danger');
      }
    } catch (err) {
      console.error(err);
      triggerFeedback('Error de conexión', 'danger');
    }
  };

  const handleAttendanceChange = (index: number, key: keyof VolunteerAttendance, value: any) => {
    const updated = [...attendanceList];
    updated[index] = { ...updated[index], [key]: value };
    setAttendanceList(updated);
  };

  const handleSaveAttendance = async () => {
    if (!selectedActivityId) {
      triggerFeedback('Por favor selecciona una jornada para calificar asistencia', 'danger');
      return;
    }

    try {
      const payload = attendanceList.map(a => ({
        id_voluntario: a.id_voluntario,
        asistio: a.asistio,
        horas_trabajadas: a.horas_acreditadas || 0,
        rol_en_actividad: a.rol || 'Voluntario General'
      }));

      const res = await fetch(`/api/v1/coordinador/actividades/${selectedActivityId}/asistencia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        triggerFeedback('Asistencias y horas acreditadas con éxito', 'success');
        handleLoadActivityEnrollment(selectedActivityId);
        window.dispatchEvent(new Event('reload-alerts'));
      } else {
        triggerFeedback('Error al guardar asistencia', 'danger');
      }
    } catch (err) {
      console.error(err);
      triggerFeedback('Error de conexión', 'danger');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  const currentProjectName = projects.find(p => p.idProyecto === selectedProjectId)?.nombreCampana || 'Proyecto LinkONG';


  return (
    <DashboardShell
      navItems={[
        { id: 'mis-proyectos', icon: '📋', label: 'Mis Proyectos' },
        { id: 'planificacion', icon: '📅', label: 'Planificación' },
        { id: 'asistencia', icon: '✅', label: 'Control de Asistencia' }
      ]}
      activeSection={activeSection}
      onNav={setActiveSection}
      pageTitle="Dashboard del Coordinador"
      pageSubtitle="Gestión operativa y trabajo en campo"
      roleColor="var(--secondary)"
    >
      {feedback && (
        <div className={`alert alert-${feedback.type} mb-3`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{feedback.message}</span>
          <button style={{ background: 'transparent', color: 'inherit', fontWeight: 'bold' }} onClick={() => setFeedback(null)}>×</button>
        </div>
      )}

      <div className="grid-2">
        <div>
          {activeSection === 'mis-proyectos' && (
            <div className="fade-in card">
              <h3 className="section-title mb-2">Mis Proyectos Asignados</h3>
              {projects.length === 0 ? (
                <div className="alert alert-info">No tienes proyectos asignados actualmente.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {projects.map(p => {
                    const balance = balances[p.idProyecto];
                    const projActs = activities[p.idProyecto] || [];

                    return (
                      <div key={p.idProyecto} className="card mb-2" style={{ borderLeft: '4px solid var(--secondary)' }}>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold">{p.nombreCampana}</h4>
                          <span className="badge badge-info">{p.estadoProyecto}</span>
                        </div>
                        <p className="text-sm text-secondary mb-2">{p.descripcionObjetivo}</p>
                        
                        <div className="grid-3 mb-2" style={{ background: 'var(--bg-card2)', padding: '0.75rem', borderRadius: '8px' }}>
                          <div>
                            <span className="text-xs text-muted block">Recaudado</span>
                            <span className="text-sm font-bold text-primary">{formatCurrency(balance?.donaciones_totales || 0)}</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted block">Gastado</span>
                            <span className="text-sm font-bold text-orange">{formatCurrency(balance?.gastos_totales || 0)}</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted block">Balance Local</span>
                            <span className={`text-sm font-bold ${balance?.balance_local >= 0 ? 'text-success' : 'text-danger'}`}>
                              {formatCurrency(balance?.balance_local || 0)}
                            </span>
                          </div>
                        </div>

                        <div className="divider" />
                        <h5 className="text-xs font-bold text-muted mb-1 uppercase tracking-wider">Jornadas Programadas</h5>
                        {projActs.length === 0 ? (
                          <span className="text-xs text-muted">No hay jornadas creadas. Ve a Planificación para agregar una.</span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {projActs.map(act => (
                              <div key={act.idActividad} className="flex justify-between items-center text-xs p-1 rounded" style={{ background: 'var(--bg-card2)' }}>
                                <span className="font-bold">{act.tituloActividad}</span>
                                <span className="text-muted">{act.fechaEjecucion.split('T')[0]} ({act.cuposVoluntariosRequeridos} cupos)</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeSection === 'planificacion' && (
            <div className="fade-in card">
              <h3 className="section-title mb-2">Planificación de Actividades</h3>
              <p className="text-sm text-muted mb-3">Programa frentes de obra o jornadas voluntarias para tus campañas.</p>
              
              <div className="form-group">
                <label className="form-label">Seleccionar Proyecto Destino</label>
                <select className="form-control" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
                  <option value="">-- Elige Proyecto --</option>
                  {projects.map(p => (
                    <option key={p.idProyecto} value={p.idProyecto}>{p.nombreCampana}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Nombre de la Jornada</label>
                <input type="text" className="form-control" placeholder='Ej: "Fundido de cimiento" o "Pintura exterior"' value={actTitle} onChange={(e) => setActTitle(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción Operativa</label>
                <input type="text" className="form-control" placeholder='Ej: "Llevar ropa cómoda y calzado de seguridad"' value={actDesc} onChange={(e) => setActDesc(e.target.value)} />
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Fecha y Hora</label>
                  <input type="datetime-local" className="form-control" value={actDate} onChange={(e) => setActDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Cupos de Voluntarios</label>
                  <input type="number" className="form-control" min={1} value={actSlots} onChange={(e) => setActSlots(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado Inicial</label>
                  <select className="form-control" value={actStatus} onChange={(e) => setActStatus(e.target.value as any)}>
                    <option value="Programada">Programada</option>
                    <option value="Confirmada">Confirmada</option>
                  </select>
                </div>
              </div>

              <button className="btn btn-primary mt-1" onClick={handleProgramActivity}>🗓️ Programar Jornada</button>
            </div>
          )}

          {activeSection === 'asistencia' && (
            <div className="fade-in card">
              <h3 className="section-title mb-2">Trazabilidad de Asistencia</h3>
              <p className="text-sm text-muted mb-3">Marca asistencia al finalizar la actividad para acreditar las horas correspondientes.</p>
              
              <div className="form-group mb-3">
                <label className="form-label">Seleccionar Jornada</label>
                <select className="form-control" value={selectedActivityId} onChange={(e) => setSelectedActivityId(e.target.value)}>
                  <option value="">-- Elige Jornada Activa --</option>
                  {projects.map(p => (
                    <optgroup key={p.idProyecto} label={p.nombreCampana}>
                      {(activities[p.idProyecto] || []).map(act => (
                        <option key={act.idActividad} value={act.idActividad}>
                          {act.tituloActividad} ({act.fechaEjecucion.split('T')[0]})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {selectedActivityId && (
                <div className="fade-in">
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Voluntario</th>
                          <th>Correo</th>
                          <th>Asistió</th>
                          <th>Rol en Jornada</th>
                          <th style={{ width: '100px' }}>Horas Acreditadas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceList.length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ textAlign: 'center' }} className="text-muted">
                              No hay voluntarios postulados todavía a esta jornada.
                            </td>
                          </tr>
                        ) : (
                          attendanceList.map((a, index) => (
                            <tr key={a.id_voluntario}>
                              <td className="font-bold">{a.nombre_voluntario}</td>
                              <td className="text-xs text-muted">{a.correo_voluntario}</td>
                              <td>
                                <input 
                                  type="checkbox" 
                                  checked={a.asistio || false} 
                                  onChange={(e) => handleAttendanceChange(index, 'asistio', e.target.checked)} 
                                />
                              </td>
                              <td>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  style={{ padding: '0.2rem', fontSize: '0.8rem' }}
                                  value={a.rol || 'Voluntario'} 
                                  onChange={(e) => handleAttendanceChange(index, 'rol', e.target.value)} 
                                />
                              </td>
                              <td>
                                <input 
                                  type="number" 
                                  className="form-control" 
                                  min={0}
                                  step={0.5}
                                  value={a.horas_acreditadas || 0} 
                                  onChange={(e) => handleAttendanceChange(index, 'horas_acreditadas', parseFloat(e.target.value))} 
                                  style={{ width: '70px', padding: '0.2rem' }} 
                                />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {attendanceList.length > 0 && (
                    <button className="btn btn-success btn-full mt-3" onClick={handleSaveAttendance}>
                      💾 Registrar y Cargar Horas de Impacto
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <AlertsWebPart />
          <ConvocationStatusWebPart 
            activityTitle={selectedActivityEnrollment?.titulo_actividad || 'Ninguna seleccionada'}
            projectName={currentProjectName}
            currentEnrollment={selectedActivityEnrollment?.anotados_count || 0}
            maxEnrollment={selectedActivityEnrollment?.cupos_totales || 0}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
