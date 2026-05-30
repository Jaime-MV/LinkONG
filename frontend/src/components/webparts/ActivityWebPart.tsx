import React from 'react';

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'error';
  message: string;
}

interface ActivityWebPartProps {
  activities: ActivityItem[];
}

export const ActivityWebPart: React.FC<ActivityWebPartProps> = ({ activities }) => {
  return (
    <div className="console-card" style={{ width: '100%' }}>
      <div className="card-title" style={{ marginBottom: '1rem' }}>
        <span className="logo-icon" style={{ width: '1.75rem', height: '1.75rem', fontSize: '0.85rem', background: '#02040a' }}>🔔</span>
        Panel de Actividad Reciente y Notificaciones (Web Part)
      </div>
      <div className="console-body" style={{ minHeight: '140px', maxHeight: '200px' }}>
        {activities.length === 0 ? (
          <div className="console-line system">No hay actividad reciente en el sistema.</div>
        ) : (
          activities.map((item) => (
            <div key={item.id} className={`console-line ${
              item.type === 'success' ? 'success' : item.type === 'error' ? 'error' : 'system'
            }`}>
              [{item.timestamp}] {item.type === 'success' ? '✔' : item.type === 'error' ? '✖' : 'ℹ'} {item.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
