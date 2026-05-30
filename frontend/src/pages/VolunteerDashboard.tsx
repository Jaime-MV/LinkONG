import React, { useState } from 'react';
import { DashboardShell } from '../components/DashboardShell';
import { HoursCounterWebPart } from '../components/webparts/HoursCounterWebPart';
import { RecentActivityWebPart } from '../components/webparts/RecentActivityWebPart';

export function VolunteerDashboard() {
  const [activeSection, setActiveSection] = useState('cartelera');

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
    >
      <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div>
          {activeSection === 'cartelera' && (
            <div className="fade-in card">
              <h3 className="section-title mb-2">Cartelera Social Activa</h3>
              <div className="form-group mb-2">
                <input type="text" className="form-control" placeholder="🔍 Filtrar proyectos por localidad (ej: Santa Ana Centro)..." />
              </div>
              <div className="card" style={{ background: 'var(--bg-card2)', marginBottom: '1rem' }}>
                <div className="flex justify-between items-center mb-1">
                  <h4>Refugio Santa Ana</h4>
                  <span className="badge badge-info">Santa Ana Centro</span>
                </div>
                <p className="text-sm text-muted mb-2">Construcción de refugio temporal para familias vulnerables.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveSection('inscripcion')}>Ver jornadas disponibles</button>
              </div>
            </div>
          )}

          {activeSection === 'inscripcion' && (
            <div className="fade-in card">
              <h3 className="section-title mb-2">Calendario de Jornadas</h3>
              <p className="text-sm text-muted mb-2">Selecciona una actividad para postularte si cumples con la disponibilidad.</p>
              <div className="cal-grid mb-3">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className={`cal-day ${i === 14 ? 'has-event' : ''} ${i === 10 ? 'today' : ''}`}>
                    {i + 1}
                    {i === 14 && <div className="cal-dot"></div>}
                  </div>
                ))}
              </div>
              <div className="alert alert-info">
                <strong>Próxima: Jornada de Techado</strong>
                <p className="text-sm mt-1">Día 15 - 8:00 AM. Se requieren 12 voluntarios más.</p>
                <button className="btn btn-primary btn-sm mt-1">Postularse ahora</button>
              </div>
            </div>
          )}

          {activeSection === 'historial' && (
            <div className="fade-in card">
              <h3 className="section-title mb-2">Historial de Servicio</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Actividad</th>
                      <th>Fecha</th>
                      <th>Horas</th>
                      <th>Rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Descarga de Materiales</td>
                      <td>Hace 1 semana</td>
                      <td className="text-success font-bold">+4</td>
                      <td>Logística</td>
                    </tr>
                    <tr>
                      <td>Inducción</td>
                      <td>Hace 1 mes</td>
                      <td className="text-success font-bold">+2</td>
                      <td>Participante</td>
                    </tr>
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
    </DashboardShell>
  );
}
