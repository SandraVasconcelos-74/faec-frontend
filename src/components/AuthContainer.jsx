import React, { useState } from "react";
import Cadastro from "./Cadastro";
import Login from "./Login";
import "../styles/AuthContainer.css";

export default function AuthContainer() {
  const [isRegisterActive, setIsRegisterActive] = useState(false);

  const openRegister = () => setIsRegisterActive(true);
  const openLogin = () => setIsRegisterActive(false);

  return (
    <div className={`auth-container ${isRegisterActive ? "active" : ""}`}>
      <div className="auth-panel auth-visual">
        <div className="auth-visual-content">
          <h1>Banco de Talentos</h1>
          <p>Uma plataforma para cadastro e visualização em mapa dos Jovens do Agro do Ceará.</p>
        </div>
      </div>

      <div className="auth-panel auth-forms">
        <div className="forms-slider">
          <div className="form-slide login-slide">
            <Login openRegister={openRegister} />
          </div>
          <div className="form-slide register-slide">
            <Cadastro openLogin={openLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}
