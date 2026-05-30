export function ConvocationStatusWebPart() {
  const current = 18;
  const max = 30;
  const percentage = (current / max) * 100;

  return (
    <div className="card mb-3">
      <h3 className="section-title mb-2">Estado de Convocatoria</h3>
      <p className="text-sm text-muted mb-2">Jornada de Techado — Santa Ana Centro</p>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-bold" style={{ color: 'var(--secondary-dark)' }}>{current} postulados</span>
        <span className="text-sm text-muted">Meta: {max}</span>
      </div>
      <div className="progress-bar mb-1">
        <div className="progress-fill orange" style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-xs" style={{ textAlign: 'right', color: 'var(--secondary-dark)', fontWeight: 600 }}>
        {percentage.toFixed(0)}% completado
      </p>
    </div>
  );
}
