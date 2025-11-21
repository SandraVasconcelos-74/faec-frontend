import React, { useState } from 'react';

export default function Mapa({ dados }) {
  // Controle de exibição do Modal de Detalhes
  const [selectedFazenda, setSelectedFazenda] = useState(null);

  return (
    <div style={styles.mapContainer}>
      
      {/* Overlay Informativo */}
      <div style={styles.mapOverlayHeader}>
        <h4 style={{ margin: 0, color: '#1f2937', fontSize: '0.9rem' }}>Mapa de Calor</h4>
      </div>

      {/* --- Renderização dos Marcadores (Pins) --- */}
      {dados.map((fazenda) => (
        <button
          key={fazenda.id}
          onClick={() => setSelectedFazenda(fazenda)}
          style={{ ...styles.pin, top: fazenda.top, left: fazenda.left }}
          title={fazenda.nome}
        >
          <div style={styles.pinIcon}>📍</div>
          <div style={styles.pulse}></div>
        </button>
      ))}

      {/* --- Modal de Detalhes --- */}
      {selectedFazenda && (
        <div style={styles.overlay} onClick={() => setSelectedFazenda(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, color: '#007a6e' }}>{selectedFazenda.nome}</h3>
              <button onClick={() => setSelectedFazenda(null)} style={styles.closeBtn}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.infoRow}>
                 <strong>Produtor:</strong> <span>{selectedFazenda.produtor}</span>
              </div>
              <div style={styles.infoRow}>
                 <strong>Cidade:</strong> <span>{selectedFazenda.cidade}</span>
              </div>
              <div style={styles.infoRow}>
                 <strong>Tipo:</strong> <span style={styles.tag}>{selectedFazenda.tipo}</span>
              </div>
            </div>
            
            <button style={styles.btnAction} onClick={() => alert('Navegar para perfil completo...')}>
              Ver Detalhes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Estilos CSS-in-JS ---
const styles = {
  mapContainer: {
    position: 'relative',
    width: '100%',
    height: '100%', // Ocupa 100% do container pai (Dashboard Full Screen)
    backgroundColor: '#e5e7eb',
    backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  mapOverlayHeader: {
    position: 'absolute', top: '15px', left: '15px',
    background: 'rgba(255, 255, 255, 0.9)', 
    padding: '8px 15px', borderRadius: '6px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', zIndex: 5
  },
  pin: {
    position: 'absolute', background: 'transparent', border: 'none',
    cursor: 'pointer', zIndex: 10, transform: 'translate(-50%, -100%)',
  },
  pinIcon: { fontSize: '32px', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' },
  pulse: {
    position: 'absolute', bottom: '5px', left: '50%', width: '10px', height: '10px',
    background: 'rgba(0, 122, 110, 0.4)', borderRadius: '50%', transform: 'translateX(-50%)', animation: 'pulse 2s infinite'
  },
  overlay: {
    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
    zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  modal: {
    background: '#ffffff', 
    color: '#1f2937', // Correção de contraste para fundo branco
    width: '300px', 
    borderRadius: '10px', 
    padding: '24px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)', 
    animation: 'fadeIn 0.2s ease',
    textAlign: 'left'
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '15px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px'
  },
  closeBtn: { 
    background: 'transparent', border: 'none', fontSize: '18px', 
    cursor: 'pointer', color: '#6b7280' 
  },
  modalBody: { 
    display: 'flex', flexDirection: 'column', gap: '10px', 
    fontSize: '0.95rem', color: '#374151'
  },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tag: { 
    background: '#d1fae5', color: '#047857', padding: '2px 10px', 
    borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' 
  },
  btnAction: {
    marginTop: '20px', width: '100%', padding: '12px', 
    background: '#007a6e', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'
  }
};