/* LinkONG Premium Glassmorphic Real-Time Palette Switcher */
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import type { PaletteType } from '../context/ThemeContext';
import { Palette, Check, ChevronDown } from 'lucide-react';

export const PaletteSwitcher: React.FC = () => {
  const { palette, setPalette } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const palettesList: { id: PaletteType; name: string; desc: string; colors: string[] }[] = [
    {
      id: 'palette-1',
      name: 'Confianza y Cuidado',
      desc: 'Salud, Ayuda Humanitaria, Clima',
      colors: ['#1A365D', '#48BB78', '#F7FAFC', '#DD6B20']
    },
    {
      id: 'palette-2',
      name: 'Comunidad y Empatía',
      desc: 'Acción Social, Derechos, Vivienda',
      colors: ['#2B6CB0', '#ECC94B', '#FFFFFF', '#E53E3E']
    },
    {
      id: 'palette-3',
      name: 'Neutral y Autoritaria',
      desc: 'Legal, Académico, Políticas',
      colors: ['#2D3748', '#319795', '#EDF2F7', '#D69E2E']
    }
  ];

  const activePalette = palettesList.find(p => p.id === palette) || palettesList[1];

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', zIndex: 100 }}>
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-glass)',
          color: 'var(--text-main)',
          fontWeight: 600,
          cursor: 'pointer',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Palette size={16} style={{ color: activePalette.colors[3] }} />
        <span className="mobile-hide" style={{ fontSize: '0.85rem' }}>{activePalette.name}</span>
        <ChevronDown size={14} style={{ opacity: 0.7, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'var(--transition-fast)' }} />
      </button>

      {/* Glassmorphic Dropdown Panel */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '290px',
            padding: '0.75rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            animation: 'fadeIn var(--transition-fast) forwards'
          }}
        >
          <div style={{ padding: '0.25rem 0.5rem 0.5rem 0.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Seleccionar Paleta
            </span>
          </div>

          {palettesList.map((p) => {
            const isSelected = p.id === palette;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setPalette(p.id);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isSelected ? 'var(--primary-soft)' : 'transparent',
                  color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'var(--border-color)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{p.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.desc}</span>
                  
                  {/* Colors Preview Pills */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    {p.colors.map((c, i) => (
                      <span
                        key={i}
                        title={`Color ${i === 0 ? 'Primario' : i === 1 ? 'Secundario' : i === 2 ? 'Fondo' : 'CTA'}`}
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: c,
                          border: '1px solid rgba(0,0,0,0.1)'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {isSelected && <Check size={16} style={{ color: 'var(--primary)' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
