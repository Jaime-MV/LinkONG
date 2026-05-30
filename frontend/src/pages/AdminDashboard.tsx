import React, { useState } from 'react';
import { DashboardShell } from '../components/DashboardShell';
import { StatsFinancialWebPart } from '../components/webparts/StatsFinancialWebPart';
import { ResourceDistributionWebPart } from '../components/webparts/ResourceDistributionWebPart';

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('finanzas');

  return (
    <DashboardShell
      navItems={[
        { id: 'finanzas', icon: '💰', label: 'Control Financiero' },
        { id: 'proyectos', icon: '🏗️', label: 'Gestión de Proyectos' },
        { id: 'voluntarios', icon: '👥', label: 'Gestión de Voluntarios' }
      ]}
      activeSection={activeSection}
      onNav={setActiveSection}
      pageTitle="Dashboard de Administración"
      pageSubtitle="Control macro, finanzas y auditoría"
      roleColor="var(--warning)"
    >
      {activeSection === 'finanzas' && (
        <div className="fade-in">
          <StatsFinancialWebPart />
          <div className="grid-2">
            <ResourceDistributionWebPart />
            <div className="card">
              <h3 className="section-title mb-2">Registrar Transacción</h3>
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select className="form-control">
                  <option>Ingreso (Donación)</option>
                  <option>Egreso (Gasto de Proyecto)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Monto ($)</label>
                <input type="number" className="form-control" placeholder="0.00" />
              </div>
              <div className="form-group">
                <label className="form-label">Concepto / N° Factura</label>
                <input type="text" className="form-control" placeholder="Ej. Factura 1024" />
              </div>
              <button className="btn btn-primary btn-full mt-2">Guardar Transacción</button>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'proyectos' && (
        <div className="fade-in card">
          <h3 className="section-title mb-2">Creación y Edición de Campañas</h3>
          <p className="text-muted mb-2">Asigna presupuestos, localidades y designa al Coordinador responsable.</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Campaña</th>
                  <th>Presupuesto</th>
                  <th>Localidad</th>
                  <th>Coordinador</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Refugio Santa Ana</td>
                  <td>$15,000</td>
                  <td>Santa Ana Centro</td>
                  <td>María González</td>
                  <td><button className="btn btn-secondary btn-sm">Editar</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === 'voluntarios' && (
        <div className="fade-in card">
          <h3 className="section-title mb-2">Buscador Avanzado de Voluntarios</h3>
          <div className="flex gap-2 mb-2">
            <input type="text" className="form-control" placeholder="Buscar por nombre o correo..." />
            <select className="form-control" style={{ width: '200px' }}>
              <option>Todos los estados</option>
              <option>En Inducción</option>
              <option>Activo</option>
              <option>Baja</option>
            </select>
            <button className="btn btn-primary">Buscar</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Estado Actual</th>
                  <th>Cambiar Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Juan Pérez</td>
                  <td>voluntario@linkong.org</td>
                  <td><span className="badge badge-warning">En Inducción</span></td>
                  <td>
                    <select className="form-control" style={{ padding: '0.2rem', fontSize: '0.8rem' }}>
                      <option>Activo</option>
                      <option>Baja Lógica</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
