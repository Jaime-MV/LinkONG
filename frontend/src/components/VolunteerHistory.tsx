/* LinkONG Volunteer Impact & Profile Component */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { volunteerService } from '../services/volunteerService';
import type { VolunteerProfileUpdate, ActivityRecentItem } from '../services/volunteerService';
import type { Volunteer } from '../services/adminService';
import { Clock, Award, Save } from 'lucide-react';

export const VolunteerHistory: React.FC = () => {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<Volunteer | null>(null);
  const [kpis, setKpis] = useState({ totalHoras: 0, actividadesParticipadas: 0 });
  const [recentActivities, setRecentActivities] = useState<ActivityRecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [form, setForm] = useState<VolunteerProfileUpdate>({
    nombreCompleto: '',
    telefono: '',
    habilidadesTecnicas: [],
    tallaCamiseta: 'M'
  });
  
  const [skillsRaw, setSkillsRaw] = useState('');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const volProfile = await volunteerService.getProfile(user.id);
      setProfile(volProfile);
      
      setForm({
        nombreCompleto: volProfile.nombreCompleto,
        telefono: volProfile.telefono,
        habilidadesTecnicas: volProfile.habilidadesTecnicas,
        tallaCamiseta: volProfile.tallaCamiseta
      });
      setSkillsRaw(volProfile.habilidadesTecnicas.join(', '));

      const stats = await volunteerService.getHoursSummary(user.id);
      setKpis(stats);

      const timeline = await volunteerService.getRecentActivity(user.id);
      setRecentActivities(timeline);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    
    if (!user) return;

    try {
      // Parse skills split by commas
      const skillsArray = skillsRaw
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        ...form,
        habilidadesTecnicas: skillsArray
      };

      const updated = await volunteerService.updateProfile(user.id, payload);
      setProfile(updated);
      setSuccessMsg('Perfil personal actualizado con éxito.');
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchData(); // refresh calculations
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al actualizar perfil');
    }
  };

  if (loading && !profile) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando tu historial de impacto...</div>;
  }

  // Target goal for yearly hours to fill circular KPI
  const HOURS_GOAL = 50.0;
  const pct = Math.min(100, Math.round((kpis.totalHoras / HOURS_GOAL) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Award style={{ color: 'var(--primary)' }} /> Mi Historial de Impacto
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Mide tu contribución social en horas trabajadas, revisa tus jornadas y mantén actualizados tus datos de campo.</p>
      </div>

      {successMsg && (
        <div className="badge badge-success" style={{ padding: '0.8rem 1.2rem', textTransform: 'none', borderRadius: '8px', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
          {successMsg}
        </div>
      )}

      {/* 📊 Web Parts Grid: Hours Circle + Profile Form */}
      <div className="grid-3" style={{ gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
        
        {/* Left Side: Web Part - Circular Hours Counter Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{
            padding: '2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            border: '1px solid var(--border-color)'
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: 800 }}>Contador de Horas</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Impacto social acumulado en el año actual.</p>
            </div>

            {/* Circular Progress Widget Graphic */}
            <div style={{
              position: 'relative',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: `conic-gradient(var(--primary) ${pct * 3.6}deg, var(--border-color) 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}>
              {/* Inner Circle to mask into donut shape */}
              <div style={{
                position: 'absolute',
                width: '136px',
                height: '136px',
                borderRadius: '50%',
                background: 'var(--bg-surface)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={20} style={{ color: 'var(--primary)', marginBottom: '0.2rem' }} />
                <h4 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{kpis.totalHoras}</h4>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Horas Logradas</span>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              🎯 Meta Anual: <strong>{HOURS_GOAL} horas</strong> ({pct}% completado)
            </div>
            
            <div className="badge badge-primary" style={{ textTransform: 'none', padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
              🎖️ {kpis.actividadesParticipadas} Jornadas Validadas
            </div>
          </div>
        </div>

        {/* Right Side: Update Profile Fields Form */}
        <div className="glass-panel" style={{ padding: '2rem', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            🙋‍♂️ Actualizar Mis Datos Personales
          </h3>

          {errorMsg && <div className="badge badge-danger" style={{ display: 'block', padding: '0.5rem', marginBottom: '1rem', textTransform: 'none', textAlign: 'center' }}>{errorMsg}</div>}

          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <input
                type="text"
                className="form-control"
                value={form.nombreCompleto}
                onChange={(e) => setForm(f => ({ ...f, nombreCompleto: e.target.value }))}
                required
              />
            </div>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Teléfono de Contacto</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="+503 7000-0000"
                  value={form.telefono}
                  onChange={(e) => setForm(f => ({ ...f, telefono: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Talla de Camiseta (Entrega de Kits)</label>
                <select
                  className="form-control"
                  value={form.tallaCamiseta}
                  onChange={(e) => setForm(f => ({ ...f, tallaCamiseta: e.target.value as any }))}
                >
                  <option value="S">S (Small)</option>
                  <option value="M">M (Medium)</option>
                  <option value="L">L (Large)</option>
                  <option value="XL">XL (Extra Large)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Habilidades Técnicas o Constructivas</label>
              <input
                type="text"
                className="form-control"
                placeholder="Pintura, Albañilería, Primeros Auxilios..."
                value={skillsRaw}
                onChange={(e) => setSkillsRaw(e.target.value)}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Separe sus habilidades por comas. Estas habilidades le ayudarán a los coordinadores a asignarle tareas.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                <Save size={16} /> Guardar Perfil
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* 🕒 Web Part: Actividad Reciente del Perfil (Timeline) */}
      <div className="glass-panel" style={{ padding: '2rem', border: '1px solid var(--border-color)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Línea de Tiempo y Asistencias Recientes</h3>

        {recentActivities.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            Aún no registras postulaciones o actividades completadas en tu perfil.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1.5rem' }}>
            
            {/* Vertical timeline line */}
            <div style={{
              position: 'absolute', top: '10px', bottom: '10px', left: '4px', width: '2px', background: 'var(--border-color)'
            }} />

            {recentActivities.map((item, index) => (
              <div key={index} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                
                {/* Timeline circle point */}
                <div style={{
                  position: 'absolute', left: '-29px', top: '4px', width: '12px', height: '12px', borderRadius: '50%',
                  background: item.estado === 'Asistido' ? 'var(--success)' : item.estado === 'No Asistió' ? 'var(--danger)' : 'var(--primary)',
                  border: '3px solid var(--bg-surface)'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{item.tituloActividad}</h4>
                  <span className={`badge ${
                    item.estado === 'Asistido' ? 'badge-success' : item.estado === 'No Asistió' ? 'badge-danger' : 'badge-primary'
                  }`} style={{ fontSize: '0.65rem' }}>
                    {item.estado}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {item.nombreCampana}
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>📅 {new Date(item.fecha).toLocaleString()}</span>
                  {item.estado === 'Asistido' && (
                    <>
                      <span>⏱️ <strong>Acreditado:</strong> {item.horasTrabajadas} horas</span>
                      <span>🎖️ <strong>Rol:</strong> {item.rol}</span>
                    </>
                  )}
                </div>

              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
};
export default VolunteerHistory;
