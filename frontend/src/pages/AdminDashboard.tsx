import { useState, useEffect } from 'react';
import { DashboardShell } from '../components/DashboardShell';
import { StatsFinancialWebPart } from '../components/webparts/StatsFinancialWebPart';
import { ResourceDistributionWebPart } from '../components/webparts/ResourceDistributionWebPart';

interface Project {
  idProyecto?: string;
  nombreCampana: string;
  descripcionObjetivo: string;
  localidadBeneficiada: string;
  fechaInicio: string;
  fechaFinEstimada: string;
  idCoordinadorResponsable: string;
  estadoProyecto: 'En Diagnóstico' | 'En Recaudación' | 'En Ejecución' | 'Finalizado';
}

interface Coordinator {
  idCoordinador: string;
  nombre: string;
  correo: string;
  rol: string;
}

interface Volunteer {
  idVoluntario: string;
  nombreCompleto: string;
  correoElectronico: string;
  telefono: string;
  estadoVoluntario: string;
  habilidadesTecnicas: string[];
}

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('finanzas');
  const [projects, setProjects] = useState<Project[]>([]);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  
  // Finance form state
  const [txType, setTxType] = useState<'donation' | 'expense'>('donation');
  const [txAmount, setTxAmount] = useState('');
  const [txConcept, setTxConcept] = useState('');
  const [txProjectId, setTxProjectId] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donationType, setDonationType] = useState<'MONETARIO' | 'ESPECIE'>('MONETARIO');
  const [expenseCategory, setExpenseCategory] = useState('Materiales de Construcción');
  
  // Project form state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjForm, setShowProjForm] = useState(false);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projLocality, setProjLocality] = useState('');
  const [projStart, setProjStart] = useState('');
  const [projEnd, setProjEnd] = useState('');
  const [projCoord, setProjCoord] = useState('');
  const [projStatus, setProjStatus] = useState<Project['estadoProyecto']>('En Diagnóstico');

  // Volunteer Search State
  const [searchSkill, setSearchSkill] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  // Status message
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);

  const triggerFeedback = (message: string, type: 'success' | 'danger' | 'info' = 'info') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 5000);
  };

  const loadProjectsAndCoords = async () => {
    try {
      const projRes = await fetch('/api/v1/admin/proyectos');
      if (projRes.ok) {
        const data = await projRes.json();
        setProjects(data);
      }
      
      const coordRes = await fetch('/api/v1/admin/proyectos/coordinadores');
      if (coordRes.ok) {
        const data = await coordRes.json();
        setCoordinators(data);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleSearchVolunteers = async () => {
    try {
      let url = '/api/v1/admin/voluntarios/busqueda';
      const params = new URLSearchParams();
      if (searchStatus) params.append('estado', searchStatus);
      if (searchSkill) params.append('habilidad', searchSkill);
      const query = params.toString();
      if (query) url += `?${query}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setVolunteers(data);
      } else {
        triggerFeedback('Error al buscar voluntarios', 'danger');
      }
    } catch (err) {
      console.error(err);
      triggerFeedback('Error de conexión', 'danger');
    }
  };

  useEffect(() => {
    loadProjectsAndCoords();
    handleSearchVolunteers();
  }, []);

  const handleSaveTransaction = async () => {
    if (!txAmount || !txProjectId) {
      triggerFeedback('Monto y Proyecto son requeridos', 'danger');
      return;
    }

    try {
      if (txType === 'donation') {
        const payload = {
          nombreDonante: donorName || 'Anónimo',
          correoDonante: donorEmail || 'anonimo@linkong.org',
          tipoAporte: donationType,
          montoDinero: parseFloat(txAmount),
          descripcionEspecie: donationType === 'ESPECIE' ? txConcept : '',
          idProyectoDestino: txProjectId
        };

        const res = await fetch('/api/v1/admin/donaciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          triggerFeedback('Donación registrada con éxito', 'success');
          // Reset
          setTxAmount('');
          setTxConcept('');
          setDonorEmail('');
          setDonorName('');
          window.dispatchEvent(new Event('reload-finances'));
        } else {
          const err = await res.json().catch(() => ({ error: 'Error al registrar donación' }));
          triggerFeedback(err.error || 'Error del servidor', 'danger');
        }
      } else {
        const payload = {
          idProyecto: txProjectId,
          montoGastado: parseFloat(txAmount),
          categoriaGasto: expenseCategory,
          descripcionDetalle: txConcept || 'Gasto operativo',
          numeroFacturaComprobante: `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
          fechaGasto: new Date().toISOString().split('T')[0]
        };

        const res = await fetch('/api/v1/admin/gastos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          triggerFeedback('Egreso registrado con éxito', 'success');
          setTxAmount('');
          setTxConcept('');
          window.dispatchEvent(new Event('reload-finances'));
        } else {
          const err = await res.json().catch(() => ({ error: 'Error al registrar egreso' }));
          triggerFeedback(err.error || 'Error del servidor', 'danger');
        }
      }
    } catch (err) {
      console.error(err);
      triggerFeedback('Error de conexión', 'danger');
    }
  };

  const handleSaveProject = async () => {
    if (!projName || !projDesc || !projLocality || !projStart || !projEnd || !projCoord) {
      triggerFeedback('Todos los campos son requeridos', 'danger');
      return;
    }

    const payload: Project = {
      nombreCampana: projName,
      descripcionObjetivo: projDesc,
      localidadBeneficiada: projLocality,
      fechaInicio: projStart,
      fechaFinEstimada: projEnd,
      idCoordinadorResponsable: projCoord,
      estadoProyecto: projStatus
    };

    try {
      const url = editingProject?.idProyecto 
        ? `/api/v1/admin/proyectos/${editingProject.idProyecto}` 
        : '/api/v1/admin/proyectos';
      const method = editingProject?.idProyecto ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        triggerFeedback(`Proyecto ${editingProject ? 'actualizado' : 'creado'} con éxito`, 'success');
        setShowProjForm(false);
        setEditingProject(null);
        // Clear
        setProjName('');
        setProjDesc('');
        setProjLocality('');
        setProjStart('');
        setProjEnd('');
        setProjCoord('');
        setProjStatus('En Diagnóstico');
        loadProjectsAndCoords();
      } else {
        const err = await res.json().catch(() => ({ error: 'Error al guardar proyecto' }));
        triggerFeedback(err.error || 'Error del servidor', 'danger');
      }
    } catch (err) {
      console.error(err);
      triggerFeedback('Error de conexión', 'danger');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este proyecto?')) return;
    try {
      const res = await fetch(`/api/v1/admin/proyectos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerFeedback('Proyecto eliminado', 'success');
        loadProjectsAndCoords();
      } else {
        triggerFeedback('No se puede eliminar un proyecto con historial contable activo', 'danger');
      }
    } catch (err) {
      console.error(err);
      triggerFeedback('Error de conexión', 'danger');
    }
  };

  const handleEditProjectClick = (p: Project) => {
    setEditingProject(p);
    setProjName(p.nombreCampana);
    setProjDesc(p.descripcionObjetivo);
    setProjLocality(p.localidadBeneficiada);
    setProjStart(p.fechaInicio);
    setProjEnd(p.fechaFinEstimada);
    setProjCoord(p.idCoordinadorResponsable);
    setProjStatus(p.estadoProyecto);
    setShowProjForm(true);
  };

  const handleUpdateVolunteerStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/admin/voluntarios/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: newStatus })
      });

      if (res.ok) {
        triggerFeedback('Estado del voluntario actualizado', 'success');
        handleSearchVolunteers();
      } else {
        triggerFeedback('Error al actualizar estado', 'danger');
      }
    } catch (err) {
      console.error(err);
      triggerFeedback('Error de conexión', 'danger');
    }
  };

  return (
    <DashboardShell
      navItems={[
        { id: 'finanzas', icon: '💰', label: 'Control Financiero' },
        { id: 'proyectos', icon: '🏗️', label: 'Gestión de Proyectos' },
        { id: 'voluntarios', icon: '👥', label: 'Gestión de Voluntarios' }
      ]}
      activeSection={activeSection}
      onNav={setActiveSection}
      pageTitle="Dashboard de Administración"
      pageSubtitle="Control macro, finanzas y auditoría"
      roleColor="var(--primary)"
    >
      {feedback && (
        <div className={`alert alert-${feedback.type} mb-3`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{feedback.message}</span>
          <button style={{ background: 'transparent', color: 'inherit', fontWeight: 'bold' }} onClick={() => setFeedback(null)}>×</button>
        </div>
      )}

      {activeSection === 'finanzas' && (
        <div className="fade-in">
          <StatsFinancialWebPart />
          <div className="grid-2">
            <ResourceDistributionWebPart />
            <div className="card">
              <h3 className="section-title mb-2">Registrar Transacción</h3>
              
              <div className="form-group">
                <label className="form-label">Tipo de Transacción</label>
                <select className="form-control" value={txType} onChange={(e) => setTxType(e.target.value as any)}>
                  <option value="donation">Ingreso (Donación)</option>
                  <option value="expense">Egreso (Gasto de Proyecto)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Proyecto Asociado</label>
                <select className="form-control" value={txProjectId} onChange={(e) => setTxProjectId(e.target.value)}>
                  <option value="">-- Selecciona Proyecto --</option>
                  {projects.map(p => (
                    <option key={p.idProyecto} value={p.idProyecto}>{p.nombreCampana}</option>
                  ))}
                </select>
              </div>

              {txType === 'donation' ? (
                <>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Nombre del Donante</label>
                      <input type="text" className="form-control" placeholder="Opcional" value={donorName} onChange={(e) => setDonorName(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Correo Donante</label>
                      <input type="email" className="form-control" placeholder="requerido@mail.com" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tipo Aporte</label>
                    <select className="form-control" value={donationType} onChange={(e) => setDonationType(e.target.value as any)}>
                      <option value="MONETARIO">Monetario (Dinero)</option>
                      <option value="ESPECIE">En Especie (Bienes)</option>
                    </select>
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label className="form-label">Categoría Gasto</label>
                  <select className="form-control" value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)}>
                    <option value="Materiales de Construcción">Materiales de Construcción</option>
                    <option value="Transporte de Voluntarios">Transporte de Voluntarios</option>
                    <option value="Alimentación/Hidratación">Alimentación/Hidratación</option>
                    <option value="Herramientas">Herramientas</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">{txType === 'donation' && donationType === 'ESPECIE' ? 'Valor Estimado ($)' : 'Monto ($)'}</label>
                <input type="number" className="form-control" placeholder="0.00" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {txType === 'donation' && donationType === 'ESPECIE' ? 'Descripción de Bienes' : 'Concepto / Detalle'}
                </label>
                <input type="text" className="form-control" placeholder="Ej. Ladrillos de concreto o Compra de cemento" value={txConcept} onChange={(e) => setTxConcept(e.target.value)} />
              </div>

              <button className="btn btn-primary btn-full mt-2" onClick={handleSaveTransaction}>
                Guardar Transacción
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'proyectos' && (
        <div className="fade-in">
          <div className="section-header">
            <h3 className="section-title">Campañas Habitacionales</h3>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setEditingProject(null);
                setProjName('');
                setProjDesc('');
                setProjLocality('');
                setProjStart('');
                setProjEnd('');
                setProjCoord('');
                setProjStatus('En Diagnóstico');
                setShowProjForm(true);
              }}
            >
              ➕ Nueva Campaña
            </button>
          </div>

          {showProjForm && (
            <div className="card mb-3 fade-in" style={{ borderLeft: '4px solid var(--secondary)' }}>
              <h4 className="font-bold mb-2">{editingProject ? 'Editar Campaña' : 'Crear Nueva Campaña'}</h4>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Nombre de Campaña</label>
                  <input type="text" className="form-control" value={projName} onChange={(e) => setProjName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Localidad Beneficiada</label>
                  <input type="text" className="form-control" value={projLocality} onChange={(e) => setProjLocality(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Objetivos del Proyecto</label>
                <textarea className="form-control" rows={3} value={projDesc} onChange={(e) => setProjDesc(e.target.value)} />
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Fecha de Inicio</label>
                  <input type="date" className="form-control" value={projStart} onChange={(e) => setProjStart(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha Fin Estimada</label>
                  <input type="date" className="form-control" value={projEnd} onChange={(e) => setProjEnd(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <select className="form-control" value={projStatus} onChange={(e) => setProjStatus(e.target.value as any)}>
                    <option value="En Diagnóstico">En Diagnóstico</option>
                    <option value="En Recaudación">En Recaudación</option>
                    <option value="En Ejecución">En Ejecución</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Coordinador Responsable</label>
                <select className="form-control" value={projCoord} onChange={(e) => setProjCoord(e.target.value)}>
                  <option value="">-- Asignar Coordinador --</option>
                  {coordinators.map(c => (
                    <option key={c.idCoordinador} value={c.idCoordinador}>{c.nombre} ({c.correo})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <button className="btn btn-secondary" onClick={() => setShowProjForm(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleSaveProject}>Guardar Campaña</button>
              </div>
            </div>
          )}

          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Campaña</th>
                    <th>Localidad</th>
                    <th>Estado</th>
                    <th>Cronograma</th>
                    <th>Coordinador</th>
                    <th style={{ textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center' }} className="text-muted">No hay campañas habitacionales registradas.</td>
                    </tr>
                  ) : (
                    projects.map(p => {
                      const coordName = coordinators.find(c => c.idCoordinador === p.idCoordinadorResponsable)?.nombre || 'Sin asignar';
                      return (
                        <tr key={p.idProyecto}>
                          <td className="font-bold">{p.nombreCampana}</td>
                          <td>{p.localidadBeneficiada}</td>
                          <td>
                            <span className={`badge ${
                              p.estadoProyecto === 'Finalizado' ? 'badge-success' :
                              p.estadoProyecto === 'En Ejecución' ? 'badge-info' :
                              p.estadoProyecto === 'En Recaudación' ? 'badge-orange' : 'badge-warning'
                            }`}>
                              {p.estadoProyecto}
                            </span>
                          </td>
                          <td className="text-xs text-muted">{p.fechaInicio} al {p.fechaFinEstimada}</td>
                          <td>{coordName}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="flex gap-1" style={{ justifyContent: 'flex-end' }}>
                              <button className="btn btn-secondary btn-sm" onClick={() => handleEditProjectClick(p)}>✏️ Editar</button>
                              <button className="btn btn-danger btn-sm" onClick={() => p.idProyecto && handleDeleteProject(p.idProyecto)}>🗑️ Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'voluntarios' && (
        <div className="fade-in card">
          <h3 className="section-title mb-2">Buscador Avanzado de Voluntarios</h3>
          
          <div className="grid-3 mb-3">
            <div className="form-group">
              <label className="form-label">Filtrar por Habilidad</label>
              <input type="text" className="form-control" placeholder="Ej. Albañilería, Pintura..." value={searchSkill} onChange={(e) => setSearchSkill(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Filtrar por Estado</label>
              <select className="form-control" value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="En Inducción">En Inducción</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-primary btn-full" onClick={handleSearchVolunteers}>🔍 Buscar</button>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Correo Electrónico</th>
                  <th>Teléfono</th>
                  <th>Habilidades</th>
                  <th>Estado Actual</th>
                  <th style={{ width: '180px' }}>Cambiar Estado</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }} className="text-muted">No se encontraron voluntarios.</td>
                  </tr>
                ) : (
                  volunteers.map(v => (
                    <tr key={v.idVoluntario}>
                      <td className="font-bold">{v.nombreCompleto}</td>
                      <td>{v.correoElectronico}</td>
                      <td>{v.telefono}</td>
                      <td>
                        <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                          {v.habilidadesTecnicas?.map((h, i) => (
                            <span key={i} className="badge badge-info">{h}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          v.estadoVoluntario === 'Activo' ? 'badge-success' :
                          v.estadoVoluntario === 'En Inducción' ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {v.estadoVoluntario}
                        </span>
                      </td>
                      <td>
                        <select 
                          className="form-control" 
                          style={{ padding: '0.25rem', fontSize: '0.8rem' }}
                          value={v.estadoVoluntario}
                          onChange={(e) => handleUpdateVolunteerStatus(v.idVoluntario, e.target.value)}
                        >
                          <option value="En Inducción">En Inducción</option>
                          <option value="Activo">Activo</option>
                          <option value="Inactivo">Inactivo</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
