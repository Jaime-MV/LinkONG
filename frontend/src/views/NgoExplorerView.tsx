import React, { useState, useEffect } from 'react';

interface Ngo {
  id: number;
  name: string;
  category: string;
  description: string;
  volunteersNeeded: number;
  location: string;
  contactEmail: string;
}

interface NgoExplorerViewProps {
  ngos: Ngo[];

  onRegisterVolunteer: (ngoId: number, ngoName: string) => void;
}

export const NgoExplorerView: React.FC<NgoExplorerViewProps> = ({ 
  ngos, 

  onRegisterVolunteer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [filteredNgos, setFilteredNgos] = useState<Ngo[]>(ngos);

  // Extract unique categories and locations for select inputs
  const categories = Array.from(new Set(ngos.map(n => n.category)));
  const locations = Array.from(new Set(ngos.map(n => n.location)));

  useEffect(() => {
    let result = ngos;

    if (searchTerm.trim() !== '') {
      result = result.filter(n => 
        n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== '') {
      result = result.filter(n => n.category === selectedCategory);
    }

    if (selectedLocation !== '') {
      result = result.filter(n => n.location === selectedLocation);
    }

    setFilteredNgos(result);
  }, [searchTerm, selectedCategory, selectedLocation, ngos]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Dynamic Filters Area */}
      <section style={{ 
        background: 'var(--bg-card)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '20px', 
        padding: '1.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
        boxShadow: 'var(--shadow-premium)'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Buscador Dinámico de ONGs (Filtros React)</h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Buscar por Nombre/Descripción</label>
            <input 
              type="text"
              placeholder="Ej: reforestación, EcoVida..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: '#060913',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.75rem',
                color: 'white',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Filtrar por Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                background: '#060913',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.75rem',
                color: 'white',
                fontSize: '0.9rem'
              }}
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Filtrar por Ubicación</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{
                width: '100%',
                background: '#060913',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.75rem',
                color: 'white',
                fontSize: '0.9rem'
              }}
            >
              <option value="">Todas las ubicaciones</option>
              {locations.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Directory Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Directorio de Organizaciones ({filteredNgos.length})</h2>

        {filteredNgos.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px dashed var(--border-color)',
            borderRadius: '20px',
            padding: '4rem 2rem',
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            No se encontraron ONGs que coincidan con los filtros seleccionados.
          </div>
        ) : (
          <div className="grid-container">
            {filteredNgos.map((ngo) => (
              <div className="card" key={ngo.id} style={{ gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="badge" style={{ margin: 0, fontSize: '0.75rem' }}>{ngo.category}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>📍 {ngo.location}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{ngo.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', flexGrow: 1 }}>{ngo.description}</p>
                <div style={{ 
                  borderTop: '1px solid var(--border-color)', 
                  paddingTop: '0.75rem', 
                  marginTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>
                    Voluntarios Necesarios: {ngo.volunteersNeeded}
                  </div>
                  <button 
                    onClick={() => onRegisterVolunteer(ngo.id, ngo.name)}
                    className="btn-primary" 
                    style={{ fontSize: '0.8rem', padding: '0.45rem 1rem', borderRadius: '8px', boxShadow: 'none' }}
                  >
                    🤝 Postularme
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
