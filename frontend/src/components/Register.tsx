/* LinkONG Volunteer Signup Component */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMockTable, saveMockTable, generateUUID } from '../services/api';
import { User, Mail, Phone, Calendar, Award, ShieldAlert, Key, ArrowRight, UserPlus } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [tallaCamiseta, setTallaCamiseta] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [habilidadesRaw, setHabilidadesRaw] = useState('');
  const [contrasena, setContrasena] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(false);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(correoElectronico)) {
      setErrorMsg('Por favor ingrese un correo electrónico válido.');
      return;
    }

    try {
      setLoading(true);
      // Simulate brief validation delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const volunteers = getMockTable('voluntarios');
      const coordinators = getMockTable('coordinadores');

      // Check if email already registered (volunteers or coordinators)
      const emailLower = correoElectronico.trim().toLowerCase();
      const emailExists = volunteers.some(v => v.correoElectronico.toLowerCase() === emailLower) ||
                          coordinators.some(c => c.correo.toLowerCase() === emailLower);

      if (emailExists) {
        throw new Error('Este correo electrónico ya se encuentra registrado en el sistema.');
      }

      // Parse skills
      const skillsArray = habilidadesRaw
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      if (skillsArray.length === 0) {
        throw new Error('Por favor especifique al menos una habilidad constructiva o técnica.');
      }

      // Create new volunteer object
      const newVol = {
        id: generateUUID(),
        nombreCompleto: nombreCompleto.trim(),
        correoElectronico: emailLower,
        telefono: telefono.trim(),
        fechaNacimiento: fechaNacimiento,
        habilidadesTecnicas: skillsArray,
        tallaCamiseta: tallaCamiseta,
        estadoVoluntario: 'En Inducción' as const, // Waiting safety clearances!
        fechaRegistro: new Date().toISOString()
      };

      // Push and save
      volunteers.push(newVol);
      saveMockTable('voluntarios', volunteers);

      // Auto login using the AuthContext to update React states dynamically
      await login(correoElectronico, contrasena);

      // Redirect directly to volunteer portal!
      navigate('/voluntario');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al completar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 10% 20%, rgb(4, 11, 29) 0%, rgb(18, 22, 45) 90.1%)',
      padding: '2.5rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Blur Spheres */}
      <div style={{
        position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
        background: 'hsla(var(--primary-hue), var(--primary-sat), var(--primary-light), 0.15)',
        filter: 'blur(80px)', top: '-50px', left: '-50px', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
        background: 'hsla(199, 89%, 48%, 0.12)',
        filter: 'blur(100px)', bottom: '-100px', right: '-100px', pointerEvents: 'none'
      }} />

      <div className="glass-panel anim-fade-in" style={{
        width: '100%',
        maxWidth: '560px',
        padding: '2.5rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(17, 22, 43, 0.75)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        zIndex: 10
      }}>
        {/* Header branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--primary), var(--info))',
            color: 'white',
            boxShadow: 'var(--shadow-glow)',
            marginBottom: '1rem'
          }}>
            <UserPlus size={26} />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800, marginBottom: '0.25rem' }}>Únete como Voluntario</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>Sé parte de la construcción de un nuevo futuro habitacional.</p>
        </div>

        {/* Error notification badge */}
        {errorMsg && (
          <div className="badge badge-danger" style={{
            padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', textTransform: 'none',
            fontSize: '0.85rem', fontWeight: 500, width: '100%', display: 'block', textAlign: 'center',
            marginBottom: '1.25rem'
          }}>
            {errorMsg}
          </div>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="form-group">
            <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} /> Nombre Completo
              </span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: Juan Antonio Pérez"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              required
              style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}
            />
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={15} /> Correo Electrónico
                </span>
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="juan@ejemplo.com"
                value={correoElectronico}
                onChange={(e) => setCorreoElectronico(e.target.value)}
                required
                style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={15} /> Teléfono Móvil
                </span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="+503 7123-4567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={15} /> Fecha de Nacimiento
                </span>
              </label>
              <input
                type="date"
                className="form-control"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                required
                style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldAlert size={15} /> Talla de Camiseta
                </span>
              </label>
              <select
                className="form-control"
                value={tallaCamiseta}
                onChange={(e) => setTallaCamiseta(e.target.value as any)}
                required
                style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}
              >
                <option value="S" style={{ color: '#000' }}>S (Small)</option>
                <option value="M" style={{ color: '#000' }}>M (Medium)</option>
                <option value="L" style={{ color: '#000' }}>L (Large)</option>
                <option value="XL" style={{ color: '#000' }}>XL (Extra Large)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={15} /> Habilidades Constructivas o Técnicas
              </span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: Pintura, Albañilería, Primeros Auxilios..."
              value={habilidadesRaw}
              onChange={(e) => setHabilidadesRaw(e.target.value)}
              required
              style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}
            />
            <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)', marginTop: '0.2rem' }}>
              Separe sus habilidades por comas para guardarlas individualmente.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Key size={15} /> Cree una Contraseña
              </span>
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              padding: '0.85rem',
              marginTop: '0.5rem',
              fontSize: '1rem',
              width: '100%'
            }}
          >
            {loading ? 'Procesando registro...' : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ¡Registrarme y Unirme! <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          textAlign: 'center',
          fontSize: '0.85rem'
        }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>¿Ya tienes una cuenta de voluntario? </span>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  );
};
export default Register;
