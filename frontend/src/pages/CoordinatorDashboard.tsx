import React, { useState } from 'react';
import { DashboardShell } from '../components/DashboardShell';
import { ConvocationStatusWebPart } from '../components/webparts/ConvocationStatusWebPart';
import { AlertsWebPart } from '../components/webparts/AlertsWebPart';

export function CoordinatorDashboard() {
  const [activeSection, setActiveSection] = useState('mis-proyectos');

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
      roleColor="var(--accent)"
    >
      <div className="grid-2">
        <div>
          {activeSection === 'mis-proyectos' && (
            <div className="fade-in card">
              <h3 className="section-title mb-2">Mis Proyectos Asignados</h3>
              <div className="alert alert-info mb-2">Actualmente tienes 1 proyecto activo bajo tu coordinación.</div>
              <div className="card" style={{ background: 'var(--bg-card2)' }}>
                <h4>Refugio Santa Ana</h4>
                <p className="text-sm text-muted mt-1 mb-2">Construcción de refugio temporal. Fase actual: Techado.</p>
                <div className="flex justify-between text-sm">
                  <span>Presupuesto: $15,000</span>
                  <span className="text-success">Estado: En progreso</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'planificacion' && (
            <div className="fade-in card">
              <h3 className="section-title mb-2">Planificación de Actividades</h3>
              <p className="text-sm text-muted mb-2">Crear o editar jornadas específicas para el fin de semana.</p>
              <div className="form-group">
                <label className="form-label">Nombre de la Jornada</label>
                <input type="text" className="form-control" placeholder='Ej: "Jornada de Techado"' />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha y Hora</label>
                <input type="datetime-local" className="form-control" />
              </div>
              <button className="btn btn-primary mt-1">Programar Jornada</button>
            </div>
          )}

          {activeSection === 'asistencia' && (
            <div className="fade-in card">
              <h3 className="section-title mb-2">Trazabilidad de Asistencia</h3>
              <p className="text-sm text-muted mb-2">Marca asistencia al finalizar la actividad para cargar horas.</p>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Voluntario</th>
                      <th>Asistió</th>
                      <th>Horas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Juan Pérez</td>
                      <td><input type="checkbox" defaultChecked /></td>
                      <td><input type="number" className="form-control" defaultValue={4} style={{ width: '60px', padding: '0.2rem' }} /></td>
                    </tr>
                    <tr>
                      <td>Ana Silva</td>
                      <td><input type="checkbox" /></td>
                      <td><input type="number" className="form-control" defaultValue={0} style={{ width: '60px', padding: '0.2rem' }} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button className="btn btn-success btn-full mt-2">Guardar Asistencia</button>
            </div>
          )}
        </div>

        <div>
          <AlertsWebPart />
          <ConvocationStatusWebPart />
        </div>
      </div>
    </DashboardShell>
  );
}
