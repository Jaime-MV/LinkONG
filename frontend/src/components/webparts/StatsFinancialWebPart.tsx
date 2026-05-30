import { useEffect, useState } from 'react';

interface FinanceResumen {
  ingresos_mes: number;
  egresos_mes: number;
  balance_mes: number;
  moneda: string;
}

export function StatsFinancialWebPart() {
  const [data, setData] = useState<FinanceResumen | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchResumen = () => {
    fetch('/api/v1/admin/finanzas/resumen')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching finance summary:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResumen();
    // Listen for custom transaction-added event to reload data
    const handleReload = () => fetchResumen();
    window.addEventListener('reload-finances', handleReload);
    return () => {
      window.removeEventListener('reload-finances', handleReload);
    };
  }, []);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
  };

  if (loading) {
    return <div className="kpi-grid">Cargando métricas financieras...</div>;
  }

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-icon">💰</div>
        <div className="kpi-label">Total Recaudado (Mes)</div>
        <div className="kpi-value" style={{ color: 'var(--primary)' }}>
          {formatMoney(data?.ingresos_mes || 0)}
        </div>
        <div className="kpi-sub text-success">↑ Fondo de donaciones LinkONG</div>
      </div>
      <div className="kpi-card warning">
        <div className="kpi-icon">💸</div>
        <div className="kpi-label">Total Ejecutado</div>
        <div className="kpi-value" style={{ color: 'var(--warning-dark)' }}>
          {formatMoney(data?.egresos_mes || 0)}
        </div>
        <div className="kpi-sub text-warning">Gastos operativos y de proyectos</div>
      </div>
      <div className="kpi-card success">
        <div className="kpi-icon">⚖️</div>
        <div className="kpi-label">Balance Global</div>
        <div className="kpi-value" style={{ color: 'var(--success-dark)' }}>
          {formatMoney(data?.balance_mes || 0)}
        </div>
        <div className="kpi-sub text-success">Fondo de reserva activo</div>
      </div>
    </div>
  );
}
