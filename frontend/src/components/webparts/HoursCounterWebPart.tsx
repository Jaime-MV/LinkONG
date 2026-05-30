import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export function HoursCounterWebPart() {
  const { user } = useAuth();
  const [offset, setOffset] = useState(376);
  const [hours, setHours] = useState(0);
  const goal = 40; // Standard goal

  const fetchHours = () => {
    if (!user) return;
    fetch('/api/v1/voluntario/perfil/resumen-horas', {
      headers: {
        'X-Volunteer-Id': user.id
      }
    })
      .then(res => res.json())
      .then(data => {
        const h = Number(data.horas_totales_validadas) || 0;
        setHours(h);
        const percent = Math.min(h / goal, 1);
        setOffset(376 - 376 * percent);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchHours();
    const handleReload = () => fetchHours();
    window.addEventListener('reload-volunteer', handleReload);
    return () => window.removeEventListener('reload-volunteer', handleReload);
  }, [user]);

  const remaining = Math.max(goal - hours, 0);

  return (
    <div className="card mb-3" style={{ textAlign: 'center' }}>
      <h3 className="section-title mb-2" style={{ justifyContent: 'center' }}>Horas de Impacto</h3>
      <div className="circle-widget">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle className="circle-bg" cx="70" cy="70" r="60" />
          <circle
            className="circle-fill"
            cx="70" cy="70" r="60"
            style={{ stroke: 'var(--success)', strokeDashoffset: offset }}
          />
        </svg>
        <div className="circle-center">
          <span className="circle-value">{hours}</span>
          <span className="circle-label">de {goal} hrs</span>
        </div>
      </div>
      <p className="text-sm text-muted" style={{ marginTop: '1rem' }}>
        {remaining > 0 ? (
          <>¡Faltan <strong style={{ color: 'var(--secondary)' }}>{remaining} horas</strong> para tu meta anual!</>
        ) : (
          <strong style={{ color: 'var(--success-dark)' }}>¡Meta anual cumplida! Felicitaciones 🎉</strong>
        )}
      </p>
    </div>
  );
}
