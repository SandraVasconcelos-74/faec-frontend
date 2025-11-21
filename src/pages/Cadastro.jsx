import React, { useState, useEffect } from 'react';
import '../css/Cadastro.css';

/* ==========================================================================
   CONSTANTES E UTILITÁRIOS
   ========================================================================== */
const STORAGE_KEY = 'cadastroDraft_v1';

/**
 * Algoritmo de validação de CPF (Cálculo de dígitos verificadores).
 * Retorna true se válido, false se inválido.
 */
const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  // Validação do 1º Dígito
  for (let i = 1; i <= 9; i++) 
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  // Validação do 2º Dígito
  soma = 0;
  for (let i = 1; i <= 10; i++) 
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

/* ==========================================================================
   COMPONENTE PRINCIPAL
   ========================================================================== */
export default function Cadastro({ onSwitch }) {
  // --- Gestão de Estado Local ---
  const [local, setLocal] = useState({
    name: '', email: '', farm: '', city: '', cpf: '', rg: '', password: '', role: ''
  });
  const [errors, setErrors] = useState({});

  // --- Persistência de Sessão (Draft) ---
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setLocal(JSON.parse(raw));
    } catch (err) { /* Falha silenciosa */ }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(local));
    } catch (err) { /* Falha silenciosa */ }
  }, [local]);

  // --- Manipulação de Inputs (Com Máscaras) ---
  const write = (key, value) => {
    let newValue = value;

    // Aplicação de máscara de CPF
    if (key === 'cpf') {
      newValue = newValue.replace(/\D/g, '');
      if (newValue.length > 11) newValue = newValue.slice(0, 11);
      newValue = newValue.replace(/(\d{3})(\d)/, '$1.$2');
      newValue = newValue.replace(/(\d{3})(\d)/, '$1.$2');
      newValue = newValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } 
    // Filtro numérico para RG
    else if (key === 'rg') {
      newValue = newValue.replace(/\D/g, '').slice(0, 12);
    }
    
    setLocal(prev => ({ ...prev, [key]: newValue }));
    
    // Limpeza de erro em tempo real
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  // --- Validação de Formulário ---
  const validate = (vals) => {
    const e = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!vals.name?.trim()) e.name = 'Nome obrigatório';
    
    if (!vals.email?.trim()) e.email = 'E-mail obrigatório';
    else if (!emailRegex.test(vals.email)) e.email = 'Formato de e-mail inválido';

    if (!vals.cpf) e.cpf = 'CPF obrigatório';
    else if (!validarCPF(vals.cpf)) e.cpf = 'CPF inválido';

    if (!vals.rg || vals.rg.length < 5) e.rg = 'RG inválido';

    // Regra de Negócio: Senha mínima de 6 caracteres
    if (!vals.password || vals.password.length < 6) e.password = 'Mínimo 6 caracteres';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // --- Envio do Formulário ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate(local)) return;
    
    // [INTEGRAÇÃO API]: Substituir console.log por chamada ao endpoint POST /api/usuarios
    // Exemplo: await api.post('/register', { ...local, cpf: local.cpf.replace(/\D/g, '') });
    console.log('Payload de Cadastro:', local);
    
    sessionStorage.removeItem(STORAGE_KEY);
    alert('Cadastro realizado com sucesso!');
    if (onSwitch) onSwitch();
  };

  const inputClass = (f) => (errors[f] ? 'input-error' : '');

  return (
    <form onSubmit={handleSubmit} noValidate>
      <img src="/images/logo.png" alt="Logo FAEC" className="logo-img" onError={(e) => e.target.style.display='none'} />
      <h2>Crie sua conta</h2>

      {/* Campos de Identificação Pessoal */}
      <label>Nome completo</label>
      <input 
        className={inputClass('name')} 
        value={local.name} 
        onChange={(e)=> write('name', e.target.value)} 
        placeholder="Seu nome completo"
        maxLength={100}
      />
      {errors.name && <span className="error-message">{errors.name}</span>}

      <label>E-mail</label>
      <input 
        type="email" 
        className={inputClass('email')} 
        value={local.email} 
        onChange={(e)=> write('email', e.target.value)} 
        placeholder="exemplo@email.com" 
        maxLength={100}
      />
      {errors.email && <span className="error-message">{errors.email}</span>}

      {/* Dados Complementares */}
      <label>Nome da fazenda</label>
      <input 
        value={local.farm} 
        onChange={(e)=> write('farm', e.target.value)} 
        placeholder="Opcional" 
        maxLength={80}
      />

      <label>Cidade</label>
      <input 
        value={local.city} 
        onChange={(e)=> write('city', e.target.value)} 
        placeholder="Sua cidade" 
        maxLength={50}
      />

      {/* Documentação com Máscaras */}
      <label>CPF</label>
      <input 
        className={inputClass('cpf')}
        value={local.cpf} 
        onChange={(e)=> write('cpf', e.target.value)} 
        maxLength={14}
        placeholder="000.000.000-00"
      />
      {errors.cpf && <span className="error-message">{errors.cpf}</span>}

      <label>RG</label>
      <input 
        className={inputClass('rg')}
        value={local.rg} 
        onChange={(e)=> write('rg', e.target.value)} 
        placeholder="Somente números"
        maxLength={12}
      />
      {errors.rg && <span className="error-message">{errors.rg}</span>}

      {/* Segurança e Perfil */}
      <label>Senha</label>
      <input 
        type="password" 
        className={inputClass('password')} 
        value={local.password} 
        onChange={(e)=> write('password', e.target.value)} 
        placeholder="Mínimo 6 caracteres" 
      />
      {errors.password && <span className="error-message">{errors.password}</span>}

      <label>Perfil</label>
      <select value={local.role} onChange={(e)=> write('role', e.target.value)}>
        <option value="">Selecione...</option>
        <option value="produtor">Produtor</option>
        <option value="estudante">Estudante</option>
        <option value="tecnico">Técnico</option>
        <option value="empreendedor">Empreendedor</option>
        <option value="pesquisador">Pesquisador</option>
      </select>

      <button type="submit" className="btn">Cadastrar</button>

      <footer>
        <a href="#" style={{ color: '#999', textDecoration: 'none', fontSize: '12px', display:'block', marginBottom: '10px' }}>Política de privacidade</a>
        Já tem uma conta?{' '}
        <span className="link" onClick={() => onSwitch && onSwitch()}>Entrar</span>
      </footer>
    </form>
  );
}