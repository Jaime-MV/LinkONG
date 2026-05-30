export function StatsFinancialWebPart() {
  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-icon">💰</div>
        <div className="kpi-label">Total Recaudado (Mes)</div>
        <div className="kpi-value" style={{ color: 'var(--primary)' }}>$45,200</div>
        <div className="kpi-sub text-success">↑ 12% vs mes anterior</div>
      </div>
      <div className="kpi-card warning">
        <div className="kpi-icon">💸</div>
        <div className="kpi-label">Total Ejecutado</div>
        <div className="kpi-value" style={{ color: 'var(--warning-dark)' }}>$32,150</div>
        <div className="kpi-sub text-warning">71% del presupuesto</div>
      </div>
      <div className="kpi-card success">
        <div className="kpi-icon">⚖️</div>
        <div className="kpi-label">Balance Global</div>
        <div className="kpi-value" style={{ color: 'var(--success-dark)' }}>$13,050</div>
        <div className="kpi-sub text-success">Fondo de reserva activo</div>
      </div>
    </div>
  );
}
