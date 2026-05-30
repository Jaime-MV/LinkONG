import React from 'react';

interface StatsWebPartProps {
  ngoCount: number;
  volunteerCount: number;
  projectCount: number;
}

export const StatsWebPart: React.FC<StatsWebPartProps> = ({ 
  ngoCount, 
  volunteerCount, 
  projectCount 
}) => {
  return (
    <section className="stats-bar" style={{ width: '100%' }}>
      <div className="stat-item">
        <div className="stat-val">{ngoCount}</div>
        <div className="stat-label">Organizaciones (ONG)</div>
      </div>
      <div className="stat-item">
        <div className="stat-val">{volunteerCount}</div>
        <div className="stat-label">Voluntarios Activos</div>
      </div>
      <div className="stat-item">
        <div className="stat-val">{projectCount}</div>
        <div className="stat-label">Proyectos Registrados</div>
      </div>
    </section>
  );
};
