import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Mapa from '../components/Mapa'; 
import '../css/Dashboard.css';

export default function DashboardJovem() {
  const navigate = useNavigate();
  const userEmail = sessionStorage.getItem('userEmail') || "usuario@exemplo.com";
  
  // Utilitário: Formatação de Nome de Usuário
  const getUserName = (email) => {
    if (!email) return 'Visitante';
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };

  const userName = getUserName(userEmail);
  
  // --- Estados da Aplicação ---
  const [produtores, setProdutores] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Ciclo de Vida: Carregamento de Dados ---
  useEffect(() => {
    const fetchProdutores = async () => {
      try {
        // Simulação de latência de rede
        await new Promise(resolve => setTimeout(resolve, 1000));

        // [MOCK DATA]: Dados estáticos para desenvolvimento frontend.
        // [INTEGRAÇÃO API]: Substituir array abaixo por response.data do endpoint GET /api/mapa
        const fakeData = [
          { id: 1, nome: "Fazenda Sol Nascente", produtor: "João Silva", cidade: "Fortaleza", tipo: "Agricultura Familiar", top: '30%', left: '20%' },
          { id: 2, nome: "Agro Verde", produtor: "Maria Souza", cidade: "Sobral", tipo: "Agronegócio", top: '50%', left: '60%' },
          { id: 3, nome: "Sítio Esperança", produtor: "Carlos Lima", cidade: "Quixadá", tipo: "Pecuária", top: '70%', left: '40%' },
          { id: 4, nome: "Vale do Cariri", produtor: "Ana Pereira", cidade: "Crato", tipo: "Fruticultura", top: '40%', left: '80%' },
        ];
        
        setProdutores(fakeData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutores();
  }, []);

  // --- Ações de Usuário ---
  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="dashboard-wrapper">
      
      {/* --- Header Global --- */}
      <header className="dash-header">
        <div className="brand">
          <img 
            src="/images/logo.png" 
            alt="Logo FAEC" 
            className="logo-dashboard"
            onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerText = 'FAEC Jovem'; }} 
          />
        </div>
        
        <div className="user-controls">
          <span className="user-info">Olá, <strong>{userName}</strong></span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      {/* --- Área de Conteúdo Principal --- */}
      <main className="dash-content">
        
        {/* Barra de Ferramentas / KPI */}
        <div className="top-bar">
          <div className="page-header">
            <h1>Painel de Controle</h1>
            <p>Visão geral dos produtores.</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Produtores</h3>
              <div className="value">{loading ? "-" : produtores.length}</div>
            </div>
            <div className="stat-card" style={{ borderLeftColor: '#00be68' }}>
              <h3>Cidades</h3>
              <div className="value">{loading ? "-" : "4"}</div>
            </div>
          </div>
        </div>

        {/* Componente de Mapa Visual */}
        <div className="map-section">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Carregando mapa...</p>
            </div>
          ) : (
            <Mapa dados={produtores} />
          )}
        </div>

      </main>
    </div>
  );
}