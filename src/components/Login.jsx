/// src/components/Login.jsx
import React, { useState } from "react";
import "../styles/Cadastro.css";

export default function Login({ openRegister, cadastroState }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    // Validação da senha forte
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>?,./]).{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "A senha deve ter pelo menos 8 caracteres, incluindo letra maiúscula, número e símbolo."
      );
      return; // Impede o envio se estiver inválida
    }

    console.log("Login:", { email, password });
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
            <button type="submit" className="btn">
              Entrar
            </button>
            <button
              type="button"
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                if (typeof openRegister === "function") return openRegister();
                const fallback = document.querySelector(
                  ".link-open-register"
                );
                if (fallback) fallback.click();
              }}
            >
              Cadastro
            </button>
          </div>
          <footer style={{ marginTop: 12 }}>
            <a href="#" className="muted">
              Esqueceu a senha?
            </a>
          </footer>
        </form>
      </div>
    </div>
  );
}
