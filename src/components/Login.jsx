// src/components/Login.jsx
import React from 'react';
import '../styles/telaCadastro.css';

export default function Login({ openRegister, cadastroState }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    // coloque aqui a lógica real de autenticação (fetch/axios)
    console.log('Login:', { email, password });
  };

  return (
    <div className="form-panel form-login">
      <img src="/images/logo-faec.png" alt="Logo FAEC" className="logo-img" />
      <div className="form-card" role="form" aria-labelledby="form-title-login">
        <h2 id="form-title-login">Entrar na plataforma</h2>

        <form onSubmit={handleLoginSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            className="input"
            type="email"
            placeholder="seu@exemplo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            className="input"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="actions">
            <button type="submit" className="btn">Entrar</button>
            <a href="#" className="muted">Esqueceu a senha?</a>
          </div>

          <footer style={{ marginTop: 12 }}>
            Não tem uma conta?{' '}
            <a
              href="#"
              className="link"
              onClick={(e) => {
                e.preventDefault();
                if (typeof openRegister === 'function') return openRegister();
                const fallback = document.querySelector('.link-open-register');
                if (fallback) fallback.click();
              }}
            >
              Cadastre-se
            </a>
          </footer>
        </form>
      </div>
    </div>
  );
}
