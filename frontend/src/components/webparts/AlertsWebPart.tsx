import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ActivityAlert {
  idActividad: string;
  tituloActividad: string;
  cuposVoluntariosRequeridos: number;
}

export function AlertsWebPart() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<ActivityAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    if (!user) return;
    fetch('/api/v1/coordinador/actividades/proximas/alertas', {
      headers: {
        'X-Coordinator-Id': user.id
      }
    })
      .then(res => res.json())
      .then(data => {
        setAlerts(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAlerts();
    const handleReload = () => fetchAlerts();
    window.addEventListener('reload-alerts', handleReload);
    return () => window.removeEventListener('reload-alerts', handleReload);
  }, [user]);

  if (loading) {
    return <div className="card mb-3">Cargando alertas operativas...</div>;
  }

  return (
    <div className="card mb-3">
      <h3 className="section-title mb-2">⚠️ Alertas Operativas</h3>
      {alerts.length === 0 ? (
        <div className="alert alert-success">
          <strong>Todo al día:</strong> Tus jornadas asignadas no registran alertas pendientes de personal.
        </div>
      ) : (
        alerts.map(a => (
          <div key={a.idActividad} className="alert alert-warning">
            <strong>Falta personal:</strong> La jornada <strong>"{a.tituloActividad}"</strong> requiere completar su cupo de {a.cuposVoluntariosRequeridos} voluntarios.
          </div>
        ))
      )}
    </div>
  );
}
