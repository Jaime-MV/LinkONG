import { useEffect, useState } from 'react';

interface ProjectDistribution {
  proyecto_id: string;
  nombre_proyecto: string;
  donado: number;
  gastado: number;
}

export function ResourceDistributionWebPart() {
  const [data, setData] = useState<ProjectDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDistribucion = () => {
    fetch('/api/v1/admin/finanzas/grafico-distribucion')
      .then(res => res.json())
      .then((resData: ProjectDistribution[]) => {
        setData(resData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching resource distribution:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDistribucion();
    const handleReload = () => fetchDistribucion();
    window.addEventListener('reload-finances', handleReload);
    return () => {
      window.removeEventListener('reload-finances', handleReload);
    };
  }, []);

  if (loading) {
    return <div className="card">Cargando distribución...</div>;
  }

  // Find max value to scale the graph percentages
  const maxAmount = Math.max(...data.map(d => Math.max(d.donado, d.gastado)), 1);

  return (
    <div className="card">
      <h3 className="section-title mb-3">Distribución de Recursos</h3>
      {data.length === 0 ? (
        <p className="text-muted text-sm mb-3">No hay transacciones registradas todavía.</p>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', height: '150px', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
          {data.map(d => {
            const donPct = (d.donado / maxAmount) * 100;
            const gastPct = (d.gastado / maxAmount) * 100;
            return (
              <div key={d.proyecto_id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '4px', width: '100%', height: '100px', alignItems: 'flex-end', justifyContent: 'center' }}>
                  {/* Recaudado (blue bar) */}
                  <div 
                    title={`Recaudado: $${d.donado}`}
                    style={{ width: '16px', height: `${donPct}%`, background: 'var(--primary)', borderRadius: '3px 3px 0 0', opacity: 0.85 }} 
                  />
                  {/* Gastado (orange bar) */}
                  <div 
                    title={`Gastado: $${d.gastado}`}
                    style={{ width: '16px', height: `${gastPct}%`, background: 'var(--secondary)', borderRadius: '3px 3px 0 0', opacity: 0.85 }} 
                  />
                </div>
                <span className="text-xs text-muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60px' }}>
                  {d.nombre_proyecto || 'S/N'}
                </span>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ borderTop: '1px solid var(--border)', marginTop: '1rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <div className="flex items-center gap-1">
          <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }} />
          <span className="text-xs text-muted">Recaudado</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{ width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%' }} />
          <span className="text-xs text-muted">Gastado</span>
        </div>
      </div>
    </div>
  );
}
