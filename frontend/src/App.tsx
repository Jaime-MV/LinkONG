import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif', 
      padding: '4rem 2rem', 
      textAlign: 'center', 
      maxWidth: '600px', 
      margin: '0 auto',
      color: '#333'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Proyecto LinkONG</h1>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
        El entorno de desarrollo limpio ha sido configurado con éxito. ¡Ya puedes comenzar a construir tu aplicación!
      </p>
      
      <button 
        onClick={() => setCount(c => c + 1)}
        style={{
          background: '#6366f1',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        Contador: {count}
      </button>
    </div>
  )
}

export default App
