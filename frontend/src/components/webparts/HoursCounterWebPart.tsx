import { useEffect, useState } from 'react';

export function HoursCounterWebPart() {
  const [offset, setOffset] = useState(376);
  const hours = 120;
  const goal = 200;

  useEffect(() => {
    const percent = Math.min(hours / goal, 1);
    const timer = setTimeout(() => setOffset(376 - 376 * percent), 150);
    return () => clearTimeout(timer);
  }, []);

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
        ¡Faltan <strong style={{ color: 'var(--secondary-dark)' }}>{goal - hours} horas</strong> para tu meta anual!
      </p>
    </div>
  );
}
