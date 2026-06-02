/* LinkONG Coordinator Projects & Alertas Component */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { coordinatorService } from '../services/coordinatorService';
import type { SocialProject } from '../services/adminService';
import { Briefcase, AlertTriangle, Coins, MapPin, Calendar, Bell } from 'lucide-react';

export const CoordinatorProjects: React.FC = () => {
  const { user } = useAuth();
  
  const [projects, setProjects] = useState<SocialProject[]>([]);
  const [balances, setBalances] = useState<Record<string, { donaciones: number; gastos: number; balance: number }>>({});
  const [alerts, setAlerts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const projList = await coordinatorService.getProjectsByCoordinator(user.id);
      setProjects(projList);

      // Fetch balance details for each project in parallel
      const balanceMap: Record<string, { donaciones: number; gastos: number; balance: number }> = {};
      for (const p of projList) {
        if (p.id) {
          const bal = await coordinatorService.getLocalBalance(p.id);
          balanceMap[p.id] = bal;
        }
      }
      setBalances(balanceMap);

      // Fetch alerts
      const alertList = await coordinatorService.getAlerts();
      setAlerts(alertList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando tus proyectos asignados...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Title */}
      <div>
        <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Briefcase style={{ color: 'var(--primary)' }} /> Mis Proyectos Asignados
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Frentes de trabajo operativo y control presupuestario de campo bajo tu responsabilidad.</p>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Side: Projects List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {projects.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No tienes campañas habitacionales asignadas a tu cargo actualmente.
            </div>
          ) : (
            projects.map((proj) => {
              const bal = balances[proj.id || ''] || { donaciones: 0, gastos: 0, balance: 0 };
              return (
                <div key={proj.id} className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary">{proj.estadoProyecto}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={14} /> {proj.localidadBeneficiada}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>{proj.nombreCampana}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{proj.descripcionObjetivo}</p>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Calendar size={14} /> <span><strong>Fecha Estimada:</strong> {proj.fechaInicio} al {proj.fechaFinEstimada}</span>
                    </div>
                  </div>

                  {/* 📊 Web Part: Local Balance Widget */}
                  <div className="glass-panel" style={{
                    background: 'var(--bg-base)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Coins size={15} style={{ color: 'var(--warning)' }} /> Balance Local de Fondos
                    </h4>
                    
                    <div className="grid-3" style={{ gap: '1rem', textAlign: 'center' }}>
                      <div style={{ padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '6px' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ingresos / Recaudado</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.2rem' }}>{formatUSD(bal.donaciones)}</div>
                      </div>
                      <div style={{ padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '6px' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gastos de Campo</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--danger)', marginTop: '0.2rem' }}>{formatUSD(bal.gastos)}</div>
                      </div>
                      <div style={{ padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '6px' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fondo Disponible</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.2rem' }}>{formatUSD(bal.balance)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Web Part - Alerts Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontWeight: 800 }}>
              <Bell size={18} style={{ color: 'var(--danger)' }} /> Panel de Alertas Operativas
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {alerts.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                  No se registran alertas operativas pendientes de atención.
                </div>
              ) : (
                alerts.map((alertText, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    background: 'var(--warning-soft)',
                    borderLeft: '4px solid var(--warning)',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)'
                  }}>
                    <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '0.1rem' }} />
                    <span>{alertText}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default CoordinatorProjects;
