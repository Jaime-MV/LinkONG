import React from 'react';

export function RecentActivityWebPart() {
  return (
    <div className="card">
      <h3 className="section-title mb-2">Actividad Reciente del Perfil</h3>
      <div className="timeline">
        <div className="timeline-item">
          <div className="timeline-dot upcoming">📅</div>
          <div className="timeline-body">
            <div className="timeline-title">Jornada de Techado (Confirmada)</div>
            <div className="timeline-meta">Próximo Sábado, 8:00 AM • Santa Ana Centro</div>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-dot success">✓</div>
          <div className="timeline-body">
            <div className="timeline-title">Descarga de Materiales</div>
            <div className="timeline-meta">Asistencia validada (+4 hrs) • Hace 1 semana</div>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-dot success">✓</div>
          <div className="timeline-body">
            <div className="timeline-title">Inducción de Voluntarios</div>
            <div className="timeline-meta">Asistencia validada (+2 hrs) • Hace 1 mes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
