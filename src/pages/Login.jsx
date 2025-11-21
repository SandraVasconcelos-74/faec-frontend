import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- 1. IMPORTAR O HOOK
import Cadastro from './Cadastro.jsx';
import '../css/Login.css'; 
import '../css/Cadastro.css'; 

function Login() {
  const navigate = useNavigate(); // <--- 2. INICIAR O HOOK
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // <--- 3. LÓGICA DE LOGIN FAKE
    // Validação simples: se tem email e senha > 5 digitos
    if (loginEmail && loginPassword.length > 5) {
        console.log('Logado com sucesso:', loginEmail);
        
        // Salva o token falso no navegador
        sessionStorage.setItem('authToken', 'token-de-acesso-123'); 
        
        // Redireciona para a página protegida
        navigate('/dashboard'); 
    } else {
        alert("Por favor, preencha e-mail e senha (mínimo 6 caracteres).");
    }
  };

  return (
    <div className={`container ${isSignUpActive ? "right-panel-active" : ""}`}>

      {/* TELA DE CADASTRO */}
      <div className="form-container sign-up-container">
        <Cadastro onSwitch={() => setIsSignUpActive(false)} />
      </div>

      {/* TELA DE LOGIN */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleLoginSubmit}>
          <img src="/images/logo.png" alt="Logo FAEC" className="logo-img" onError={(e) => e.target.style.display='none'}/>
          <h2>Entrar na plataforma</h2>

          <label>E-mail</label>
          <input
            type="email"
            placeholder="seu@exemplo.com"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />

          <label>Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          <div className="actions" style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <button type="submit" className="btn" style={{ width: 'auto', padding: '10px 30px' }}>Entrar</button>
            <a href="#" className="link" style={{ fontSize: '13px', fontWeight: 'normal' }}>Esqueceu a senha?</a>
          </div>

          <footer style={{ marginTop: '20px' }}>
            Não tem uma conta?{' '}
            <span className="link" style={{ cursor: 'pointer' }} onClick={() => setIsSignUpActive(true)}>
              Cadastre-se
            </span>
          </footer>
        </form>
      </div>

      {/* OVERLAY */}
      <div className="overlay-container">
        <div className="overlay"></div>
        <div className="visual-content">
          <h1 style={{ color: 'white' }}>Banco de Talentos</h1>
          <p style={{ color: 'white' }}>
            Um espaço de protagonismo, inovação e representatividade que conecta tradição e futuro do agro.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Login;