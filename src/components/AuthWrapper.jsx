// src/components/AuthWrapper.jsx
import React, { useEffect, useRef, useState } from 'react';
import '../styles/telaCadastro.css';
import Login from './Login';
import Cadastro from './Cadastro';

export default function AuthWrapper({ LoginComp, RegisterComp, showByDefault = 'login' }) {
  const [mode, setMode] = useState(showByDefault === 'register' ? 'register' : 'login');

  const [cadastroState, setCadastroState] = useState({
    name: '',
    email: '',
    farm: '',
    city: '',
    cpf: '',
    rg: '',
    password: '',
    role: ''
  });

  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (mode === 'register') el.classList.add('register-active');
    else el.classList.remove('register-active');
  }, [mode]);

  const openRegister = () => setMode('register');
  const openLogin = () => setMode('login');

  const setField = (field, value) => {
    setCadastroState(prev => ({ ...prev, [field]: value }));
  };

  const submitCadastro = async (payload) => {
    const body = payload ?? cadastroState;
    // Substitua por fetch/axios quando tiver o endpoint:
    // await fetch('/api/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    console.log('submitCadastro:', body);
    // após sucesso:
    setMode('login');
  };

  const LoginCompToRender = LoginComp || Login;
  const RegisterCompToRender = RegisterComp || Cadastro;

  return (
    <div className="container" ref={containerRef}>
      <div className="visual" aria-hidden>
        <div className="visual-content">
          <div className="visual-text visual-login" style={{ display: mode === 'login' ? 'block' : 'none' }}>
            <h1>Banco de Talentos</h1>
            <p className="lead">Uma plataforma para cadastro e visualização em mapa dos Jovens do Agro do Ceará.</p>
          </div>
          <div className="visual-text visual-register" style={{ display: mode === 'register' ? 'block' : 'none' }}>
            <h1>Crie sua conta</h1>
            <p className="lead">Cadastre-se para acessar todas as funcionalidades.</p>
          </div>
        </div>
      </div>

      <div className="form-wrap">
        <div className="form-panel form-register" aria-hidden={mode === 'login'}>
          <RegisterCompToRender
            formState={cadastroState}
            setField={setField}
            onSubmit={submitCadastro}
            openLogin={openLogin}
          />
        </div>

        <div className="form-panel form-login" aria-hidden={mode === 'register'}>
          <LoginCompToRender openRegister={openRegister} cadastroState={cadastroState} />
        </div>
      </div>
    </div>
  );
}
