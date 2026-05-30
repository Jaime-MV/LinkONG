

interface ConvocationStatusProps {
  activityTitle?: string;
  projectName?: string;
  currentEnrollment?: number;
  maxEnrollment?: number;
}

export function ConvocationStatusWebPart({
  activityTitle = 'Jornada General',
  projectName = 'Proyecto LinkONG',
  currentEnrollment = 0,
  maxEnrollment = 10
}: ConvocationStatusProps) {
  
  const current = currentEnrollment;
  const max = Math.max(maxEnrollment, 1);
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="card mb-3">
      <h3 className="section-title mb-2">Estado de Convocatoria</h3>
      <p className="text-sm font-bold text-muted mb-2">{activityTitle} — {projectName}</p>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-bold" style={{ color: 'var(--secondary)' }}>{current} postulados</span>
        <span className="text-sm text-muted">Meta: {max}</span>
      </div>
      <div className="progress-bar mb-1">
        <div className="progress-fill orange" style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-xs" style={{ textAlign: 'right', color: 'var(--secondary)', fontWeight: 600 }}>
        {percentage.toFixed(0)}% completado
      </p>
    </div>
  );
}
