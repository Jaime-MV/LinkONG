export function ResourceDistributionWebPart() {
  const data = [
    { name: 'Refugio A', pct: 100, color: 'var(--primary)' },
    { name: 'Escuela B', pct: 60,  color: 'var(--success)' },
    { name: 'Comedor C', pct: 35,  color: 'var(--secondary)' },
  ];

  return (
    <div className="card">
      <h3 className="section-title mb-3">Distribución de Recursos</h3>
      <div style={{ display: 'flex', gap: '0.75rem', height: '120px', alignItems: 'flex-end' }}>
        {data.map(d => (
          <div key={d.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '100%', height: `${d.pct}%`, background: d.color, borderRadius: '6px 6px 0 0', opacity: 0.85 }} />
            <span className="text-xs text-muted">{d.name}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--border)', marginTop: '1rem', paddingTop: '0.75rem' }}>
        <p className="text-xs text-muted" style={{ textAlign: 'center' }}>Fondos asignados a proyectos activos este trimestre</p>
      </div>
    </div>
  );
}
