import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ActivityItem {
  asistencia_id: string;
  asistio: boolean;
  horas: number;
  rol: string;
  nombre_actividad: string;
  fecha_ejecucion: string;
  nombre_proyecto: string;
}

export function RecentActivityWebPart() {
  const { user } = useAuth();
  const [timeline, setTimeline] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = () => {
    if (!user) return;
    fetch('/api/v1/voluntario/perfil/actividad-reciente', {
      headers: {
        'X-Volunteer-Id': user.id
      }
    })
      .then(res => res.json())
      .then((data: ActivityItem[]) => {
        setTimeline(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecent();
    const handleReload = () => fetchRecent();
    window.addEventListener('reload-volunteer', handleReload);
    return () => window.removeEventListener('reload-volunteer', handleReload);
  }, [user]);

  if (loading) {
    return <div className="card">Cargando actividad reciente...</div>;
  }

  return (
    <div className="card">
      <h3 className="section-title mb-2">Actividad Reciente del Perfil</h3>
      <div className="timeline">
        {timeline.length === 0 ? (
          <p className="text-sm text-muted">No has registrado participaciones todavía.</p>
        ) : (
          timeline.map(item => (
            <div key={item.asistencia_id} className="timeline-item">
              <div className={`timeline-dot ${item.asistio ? 'success' : 'upcoming'}`}>
                {item.asistio ? '✓' : '📅'}
              </div>
              <div className="timeline-body">
                <div className="timeline-title">
                  {item.nombre_actividad} ({item.nombre_proyecto || 'LinkONG'})
                </div>
                <div className="timeline-meta">
                  {item.asistio ? (
                    <span className="text-success font-bold">Asistencia validada (+{item.horas} hrs)</span>
                  ) : (
                    <span className="text-orange font-bold">Postulación activa (Pendiente ejecución)</span>
                  )}
                  {item.fecha_ejecucion && ` • ${item.fecha_ejecucion.split('T')[0]}`}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
