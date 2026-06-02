/* LinkONG Public Homepage Landing Page */
import React from 'react';
import { Link } from 'react-router-dom';
import { PaletteSwitcher } from './PaletteSwitcher';
import { Sparkles, Users, Award, CheckCircle, ArrowRight, BookOpen, MapPin, Heart } from 'lucide-react';

export const Homepage: React.FC = () => {

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      
      {/* 🧭 Public Navigation Bar */}
      <nav className="glass-panel" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '75px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        borderRadius: 0,
        borderWidth: '0 0 1px 0',
        background: 'var(--bg-glass)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontWeight: 800, fontSize: '1.4rem' }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary), var(--info))',
            color: 'white',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Sparkles size={18} />
          </span>
          LinkONG
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="#about" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>Nosotros</a>
          <a href="#metrics" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>Impacto</a>
          <a href="#process" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>¿Cómo Funciona?</a>
          
          <PaletteSwitcher />

          <div style={{ display: 'flex', gap: '0.75rem', marginLeft: '0.5rem' }}>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', gap: '0.3rem' }}>
              Unirme <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section style={{
        padding: '6rem 2rem',
        background: 'var(--primary-gradient)',
        color: 'var(--text-inverse)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        {/* Decorative Spheres */}
        <div style={{
          position: 'absolute', width: '350px', height: '350px', borderRadius: '50%',
          background: 'var(--secondary-soft)',
          filter: 'blur(90px)', top: '-60px', left: '-50px', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
          background: 'var(--accent-soft)',
          filter: 'blur(100px)', bottom: '-100px', right: '-100px', pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 10, position: 'relative' }} className="anim-fade-in">
          <div className="badge" style={{
            alignSelf: 'center', padding: '0.4rem 1.2rem', textTransform: 'none', 
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)', 
            color: 'var(--text-inverse)',
            fontSize: '0.85rem', fontWeight: 600
          }}>
            🌟 Fundación Habitacional y Social LinkONG
          </div>
          
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', fontFamily: 'var(--font-display)', color: 'var(--text-inverse)' }}>
            Construyendo Hogares,<br />
            <span style={{ 
              background: 'linear-gradient(90deg, var(--secondary), var(--accent))', 
              WebkitBackgroundClip: 'text', 
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent', 
              color: 'transparent',
              display: 'inline-block'
            }}>
              Transformando Vidas
            </span>
          </h1>
          
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.25rem', maxWidth: '640px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
            Somos una organización sin fines de lucro dedicada a edificar viviendas de emergencia y coordinar redes voluntarias de apoyo constructivo en comunidades vulnerables.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', gap: '0.5rem', boxShadow: 'var(--shadow-glow)' }}>
              Quiero Ser Voluntario <Heart size={18} />
            </Link>
            <a href="#about" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)', color: 'var(--text-inverse)' }}>
              Conocer Más
            </a>
          </div>
        </div>
      </section>

      {/* 📊 Metrics / Impact Section */}
      <section id="metrics" style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Nuestro Impacto en Cifras</h2>
          <p style={{ color: 'var(--text-muted)' }}>La unión de voluntariado y transparencia hace posible el cambio.</p>
        </div>

        <div className="grid-3">
          <div className="premium-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '14px', background: 'var(--primary-soft)', color: 'var(--primary)', marginBottom: '1.25rem' }}>
              <BookOpen size={26} />
            </div>
            <h3 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>150+</h3>
            <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Viviendas de Emergencia</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Casas entregadas a familias que vivían en situación de riesgo estructural.</p>
          </div>

          <div className="premium-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '14px', background: 'var(--success-soft)', color: 'var(--success)', marginBottom: '1.25rem' }}>
              <Users size={26} />
            </div>
            <h3 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>500+</h3>
            <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Voluntarios Activos</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Jóvenes y profesionales comprometidos que aportan su fuerza de trabajo.</p>
          </div>

          <div className="premium-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '14px', background: 'var(--info-soft)', color: 'var(--info)', marginBottom: '1.25rem' }}>
              <Award size={26} />
            </div>
            <h3 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>12k+</h3>
            <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Horas Acreditadas</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Aporte de servicio social acreditado de forma transparente en campo.</p>
          </div>
        </div>
      </section>

      {/* 🤝 About Section */}
      <section id="about" style={{ padding: '5rem 2rem', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '3rem', alignItems: 'center' }} className="grid-2">
          
          <div>
            <span className="badge badge-info" style={{ marginBottom: '1rem' }}>Misión & Visión</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>Seguridad Habitacional e Integración Comunitaria</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <CheckCircle size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.2rem' }} />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Metodología de Campo Efectiva</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Planificamos jornadas específicas de fin de semana con líderes operativos y materiales listos para la edificación.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <CheckCircle size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.2rem' }} />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Transparencia Financiera Absoluta</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Cada dólar o donativo en especie es asignado a proyectos específicos y auditado rigurosamente por el Staff.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <CheckCircle size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.2rem' }} />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Trazabilidad e Impacto Acreditado</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Medimos y certificamos las horas de servicio que realizan los voluntarios, reflejadas en su perfil dinámico.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2.5rem', background: 'var(--bg-base)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', fontWeight: 800 }}>Nuestros Frentes Activos</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Coordinamos la construcción de hogares en diferentes regiones del país.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={15} style={{ color: 'var(--primary)' }} /> Comunidad El Espino
                </span>
                <span className="badge badge-primary">En Ejecución</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={15} style={{ color: 'var(--primary)' }} /> Santa Ana Centro
                </span>
                <span className="badge badge-warning">En Recaudación</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 🧭 Process / How it works */}
      <section id="process" style={{ padding: '5rem 2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
        <div style={{ marginBottom: '3.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>Sencillo y Seguro</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>¿Cómo unirse a LinkONG?</h2>
          <p style={{ color: 'var(--text-muted)' }}>Tres pasos sencillos para transformar el futuro de una familia.</p>
        </div>

        <div className="grid-3" style={{ gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem'
            }}>1</div>
            <h4 style={{ fontWeight: 700 }}>Completa tu Registro</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ingresa tus habilidades constructivas y talla de camiseta en el formulario público.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem'
            }}>2</div>
            <h4 style={{ fontWeight: 700 }}>Postúlate a Actividades</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ingresa al Portal de Voluntarios, revisa las jornadas y dale clic a "Postularse".</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem'
            }}>3</div>
            <h4 style={{ fontWeight: 700 }}>Asiste y Acredita</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Participa el fin de semana. El Coordinador de Campo validará tu asistencia y sumará horas a tu contador.</p>
          </div>
        </div>

        <div style={{ marginTop: '3.5rem' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1.1rem', gap: '0.5rem' }}>
            ¡Registrarme Ahora Mismo! <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 🧭 Public Footer */}
      <footer className="glass-panel" style={{
        borderRadius: 0, borderWidth: '1px 0 0 0', background: 'var(--bg-surface)', padding: '3rem 2rem',
        textAlign: 'center', borderTop: '1px solid var(--border-color)', marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-main)' }}>
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px',
              borderRadius: '7px', background: 'linear-gradient(135deg, var(--primary), var(--info))', color: 'white'
            }}>
              <Sparkles size={14} />
            </span>
            LinkONG
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '500px' }}>
            Uniendo corazones, manos y transparencia para construir hogares seguros para quienes más lo necesitan.
          </p>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', width: '100%' }}>
            © 2026 LinkONG Fundación Habitacional. Todos los derechos reservados.
          </div>
        </div>
      </footer>

    </div>
  );
};
export default Homepage;
