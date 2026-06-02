/* LinkONG Admin Financial Dashboard Component */
import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import type { Donation, Expense, SocialProject } from '../services/adminService';
import { Wallet, PlusCircle, ArrowDownCircle, ArrowUpCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

export const AdminFinancial: React.FC = () => {
  const [projects, setProjects] = useState<SocialProject[]>([]);
  const [kpis, setKpis] = useState({ totalIngresos: 0, totalEgresos: 0, balance: 0 });
  const [chartData, setChartData] = useState<Array<{ projectName: string; amount: number }>>([]);
  const [loading, setLoading] = useState(true);

  // Modals visibility
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Form states
  const [donationForm, setDonationForm] = useState<Donation>({
    nombreDonante: '',
    correoDonante: '',
    tipoAporte: 'MONETARIO',
    montoDinero: 0,
    descripcionEspecie: '',
    idProyectoDestino: ''
  });

  const [expenseForm, setExpenseForm] = useState<Expense>({
    idProyecto: '',
    montoGastado: 0,
    categoriaGasto: 'Materiales de Construcción',
    descripcionDetalle: '',
    numeroFacturaComprobante: ''
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const projList = await adminService.getProjects();
      setProjects(projList);
      
      const metrics = await adminService.getFinanceResumen();
      setKpis(metrics);

      const distributions = await adminService.getDistributionChart();
      setChartData(distributions);

      // Pre-select first project in forms
      if (projList.length > 0) {
        setDonationForm(d => ({ ...d, idProyectoDestino: projList[0].id || '' }));
        setExpenseForm(e => ({ ...e, idProyecto: projList[0].id || '' }));
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    
    if (donationForm.montoDinero <= 0) {
      setErrorMsg('El monto monetario o estimado debe ser mayor a cero.');
      return;
    }

    try {
      await adminService.recordDonation(donationForm);
      setSuccessMsg('Donación registrada con éxito.');
      setShowDonationModal(false);
      
      // Reset form
      setDonationForm({
        nombreDonante: '',
        correoDonante: '',
        tipoAporte: 'MONETARIO',
        montoDinero: 0,
        descripcionEspecie: '',
        idProyectoDestino: projects[0]?.id || ''
      });
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar donación');
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (expenseForm.montoGastado <= 0) {
      setErrorMsg('El monto del egreso debe ser mayor a cero.');
      return;
    }

    try {
      await adminService.recordExpense(expenseForm);
      setSuccessMsg('Egreso/Gasto registrado con éxito.');
      setShowExpenseModal(false);

      // Reset form
      setExpenseForm({
        idProyecto: projects[0]?.id || '',
        montoGastado: 0,
        categoriaGasto: 'Materiales de Construcción',
        descripcionDetalle: '',
        numeroFacturaComprobante: ''
      });
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar gasto');
    }
  };

  if (loading && projects.length === 0) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando datos financieros de LinkONG...</div>;
  }

  // Format cash helper
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Title & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Wallet style={{ color: 'var(--primary)' }} /> Control Financiero Macro
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Panel general de ingresos, egresos y auditoría contable de la ONG.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => { setErrorMsg(null); setSuccessMsg(null); setShowDonationModal(true); }} className="btn btn-success" style={{ gap: '0.4rem' }}>
            <PlusCircle size={18} /> Registrar Donación
          </button>
          <button onClick={() => { setErrorMsg(null); setSuccessMsg(null); setShowExpenseModal(true); }} className="btn btn-danger" style={{ gap: '0.4rem' }}>
            <PlusCircle size={18} /> Registrar Gasto
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="badge badge-success" style={{ padding: '0.8rem 1.2rem', textTransform: 'none', borderRadius: '8px', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
          {successMsg}
        </div>
      )}

      {/* 💳 KPI Cards Row */}
      <div className="grid-3">
        <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'var(--success-soft)', color: 'var(--success)'
          }}>
            <ArrowUpCircle size={26} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Donado (Ingresos)</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{formatUSD(kpis.totalIngresos)}</h3>
          </div>
        </div>

        <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'var(--danger-soft)', color: 'var(--danger)'
          }}>
            <ArrowDownCircle size={26} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Gastado (Egresos)</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{formatUSD(kpis.totalEgresos)}</h3>
          </div>
        </div>

        <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '48px', height: '48px', borderRadius: '12px',
            background: kpis.balance >= 0 ? 'var(--primary-soft)' : 'var(--danger-soft)',
            color: kpis.balance >= 0 ? 'var(--primary)' : 'var(--danger)'
          }}>
            <TrendingUp size={26} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Balance Neto General</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{formatUSD(kpis.balance)}</h3>
          </div>
        </div>
      </div>

      {/* 📊 Charts Section */}
      <div className="grid-2">
        {/* Resource distribution bar chart */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Distribución de Egresos por Proyecto</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Muestra la cantidad de recursos financieros ya ejecutada en gastos reales para cada frente.</p>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            {chartData.length === 0 || chartData.every(c => c.amount === 0) ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Sin datos de gastos registrados aún.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="projectName" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <Tooltip formatter={(value) => formatUSD(Number(value))} contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                  <Bar dataKey="amount" name="Total Gastado ($)" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Global proportions pie chart */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Proporción General Financiera</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Comparación porcentual total entre lo recaudado vs ejecutado.</p>
          </div>
          <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {kpis.totalIngresos === 0 && kpis.totalEgresos === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sin datos financieros registrados.</div>
            ) : (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Disponible (Balance)', value: kpis.balance > 0 ? kpis.balance : 0 },
                        { name: 'Gastado (Egresos)', value: kpis.totalEgresos }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell fill="var(--primary)" />
                      <Cell fill="var(--danger)" />
                    </Pie>
                    <Tooltip formatter={(value) => formatUSD(Number(value))} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)',
                  textAlign: 'center', pointerEvents: 'none'
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Eficiencia</span>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    {kpis.totalIngresos > 0 ? Math.round((kpis.totalEgresos / kpis.totalIngresos) * 100) : 0}%
                  </h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🟢 REGISTER DONATION MODAL */}
      {showDonationModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
        }}>
          <div className="glass-panel anim-fade-in" style={{
            background: 'var(--bg-surface)', padding: '2rem', width: '100%', maxWidth: '520px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              💰 Registrar Nueva Donación
            </h3>

            {errorMsg && <div className="badge badge-danger" style={{ display: 'block', padding: '0.5rem', marginBottom: '1rem', textTransform: 'none', textAlign: 'center' }}>{errorMsg}</div>}

            <form onSubmit={handleDonationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Nombre del Donante / Institución</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Banco Agrícola o Anónimo"
                  value={donationForm.nombreDonante}
                  onChange={(e) => setDonationForm(d => ({ ...d, nombreDonante: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Correo Electrónico Donante</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="correo@donante.com"
                  value={donationForm.correoDonante}
                  onChange={(e) => setDonationForm(d => ({ ...d, correoDonante: e.target.value }))}
                  required
                />
              </div>

              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tipo de Aporte</label>
                  <select
                    className="form-control"
                    value={donationForm.tipoAporte}
                    onChange={(e) => setDonationForm(d => ({ ...d, tipoAporte: e.target.value as any }))}
                  >
                    <option value="MONETARIO">Monetario ($ USD)</option>
                    <option value="ESPECIE">En Especie (Materiales/Bienes)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Monto o Valor Estimado ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="1500"
                    value={donationForm.montoDinero === 0 ? '' : donationForm.montoDinero}
                    onChange={(e) => setDonationForm(d => ({ ...d, montoDinero: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              {donationForm.tipoAporte === 'ESPECIE' && (
                <div className="form-group">
                  <label className="form-label">Descripción de los Bienes Recibidos</label>
                  <textarea
                    className="form-control"
                    placeholder="Ej: 50 sacos de cal, 20 varillas de hierro..."
                    rows={2}
                    value={donationForm.descripcionEspecie}
                    onChange={(e) => setDonationForm(d => ({ ...d, descripcionEspecie: e.target.value }))}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Campaña / Proyecto de Destino</label>
                <select
                  className="form-control"
                  value={donationForm.idProyectoDestino}
                  onChange={(e) => setDonationForm(d => ({ ...d, idProyectoDestino: e.target.value }))}
                  required
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombreCampana}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowDonationModal(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-success">Guardar Donación</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔴 REGISTER EXPENSE MODAL */}
      {showExpenseModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
        }}>
          <div className="glass-panel anim-fade-in" style={{
            background: 'var(--bg-surface)', padding: '2rem', width: '100%', maxWidth: '520px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🧱 Registrar Nuevo Egreso / Gasto
            </h3>

            {errorMsg && <div className="badge badge-danger" style={{ display: 'block', padding: '0.5rem', marginBottom: '1rem', textTransform: 'none', textAlign: 'center' }}>{errorMsg}</div>}

            <form onSubmit={handleExpenseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Proyecto Responsable</label>
                <select
                  className="form-control"
                  value={expenseForm.idProyecto}
                  onChange={(e) => setExpenseForm(d => ({ ...d, idProyecto: e.target.value }))}
                  required
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombreCampana}</option>
                  ))}
                </select>
              </div>

              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Categoría del Gasto</label>
                  <select
                    className="form-control"
                    value={expenseForm.categoriaGasto}
                    onChange={(e) => setExpenseForm(d => ({ ...d, categoriaGasto: e.target.value as any }))}
                  >
                    <option value="Materiales de Construcción">Materiales de Construcción</option>
                    <option value="Transporte de Voluntarios">Transporte de Voluntarios</option>
                    <option value="Alimentación/Hidratación">Alimentación/Hidratación</option>
                    <option value="Herramientas">Herramientas</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Monto Ejecutado ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="350"
                    value={expenseForm.montoGastado === 0 ? '' : expenseForm.montoGastado}
                    onChange={(e) => setExpenseForm(d => ({ ...d, montoGastado: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Número de Factura / Comprobante</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: FAC-2026-0410"
                  value={expenseForm.numeroFacturaComprobante}
                  onChange={(e) => setExpenseForm(d => ({ ...d, numeroFacturaComprobante: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detalle del Gasto</label>
                <textarea
                  className="form-control"
                  placeholder="Ej: Compra de 20 láminas de zinc ondulado galvanizado..."
                  rows={2}
                  value={expenseForm.descripcionDetalle}
                  onChange={(e) => setExpenseForm(d => ({ ...d, descripcionDetalle: e.target.value }))}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowExpenseModal(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-danger">Registrar Egreso</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminFinancial;
