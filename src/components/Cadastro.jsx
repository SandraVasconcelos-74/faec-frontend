// src/components/Cadastro.jsx
import React, { useState, useEffect } from 'react';
import '../styles/telaCadastro.css';

const STORAGE_KEY = 'cadastroDraft_v1';

export default function Cadastro({ formState, setField, onSubmit, openLogin }) {
  const isLifted = !!formState && typeof setField === 'function';

  const [local, setLocal] = useState({
    name: '',
    email: '',
    farm: '',
    city: '',
    cpf: '',
    rg: '',
    password: '',
    role: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isLifted) return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setLocal(JSON.parse(raw));
    } catch (err) { /* ignore */ }
  }, [isLifted]);

  useEffect(() => {
    if (isLifted) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(local));
    } catch (err) { /* ignore */ }
  }, [local, isLifted]);

  const read = (key) => (isLifted ? formState[key] ?? '' : local[key] ?? '');
  const write = (key, value) => {
    if (isLifted) return setField(key, value);
    setLocal(prev => ({ ...prev, [key]: value }));
  };

  const validate = (vals) => {
    const e = {};
    if (!vals.name?.trim()) e.name = 'Nome é obrigatório.';
    if (!vals.email?.trim()) e.email = 'E-mail é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) e.email = 'E-mail inválido.';
    if (!vals.farm?.trim()) e.farm = 'Informe o nome da fazenda.';
    if (!vals.city?.trim()) e.city = 'Cidade é obrigatória.';
    if (!vals.cpf?.trim()) e.cpf = 'CPF é obrigatório.';
    else if (!/^\d{11}$/.test((vals.cpf || '').replace(/\D/g, ''))) e.cpf = 'CPF deve ter 11 dígitos.';
    if (!vals.rg?.trim()) e.rg = 'RG é obrigatório.';
    if (!vals.password) e.password = 'Senha é obrigatória.';
    else if (vals.password.length < 6) e.password = 'Senha deve ter ao menos 6 caracteres.';
    if (!vals.role) e.role = 'Selecione um perfil.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vals = isLifted ? formState : local;
    if (!validate(vals)) return;

    try {
      if (typeof onSubmit === 'function') {
        await onSubmit(vals);
      } else {
        console.log('Cadastro (local):', vals);
        sessionStorage.removeItem(STORAGE_KEY);
      }
      if (typeof openLogin === 'function') openLogin();
    } catch (err) {
      console.error('Erro no envio do cadastro:', err);
      setErrors(prev => ({ ...prev, submit: 'Erro ao enviar cadastro. Tente mais tarde.' }));
    }
  };

  const inputClass = (f) => (errors[f] ? 'input input-error' : 'input');

  return (
    <div className="form-panel form-register">
      <img src="/images/logo-faec.png" alt="Logo FAEC" className="logo-img" />
      <div className="form-card" role="form" aria-labelledby="form-title-register">
        <h2 id="form-title-register">Crie sua conta</h2>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">Nome completo</label>
          <input id="name" className={inputClass('name')} value={read('name')} onChange={(e)=> write('name', e.target.value)} required />
          {errors.name && <div className="error-message">{errors.name}</div>}

          <label htmlFor="email-register">E-mail</label>
          <input id="email-register" className={inputClass('email')} type="email" value={read('email')} onChange={(e)=> write('email', e.target.value)} required />
          {errors.email && <div className="error-message">{errors.email}</div>}

          <label htmlFor="farm">Nome da fazenda</label>
          <input id="farm" className={inputClass('farm')} value={read('farm')} onChange={(e)=> write('farm', e.target.value)} required />
          {errors.farm && <div className="error-message">{errors.farm}</div>}

          <label htmlFor="city">Cidade</label>
          <input id="city" className={inputClass('city')} value={read('city')} onChange={(e)=> write('city', e.target.value)} required />
          {errors.city && <div className="error-message">{errors.city}</div>}

          <label htmlFor="cpf">CPF (somente números)</label>
          <input id="cpf" className={inputClass('cpf')} value={read('cpf')} onChange={(e)=> write('cpf', e.target.value.replace(/\D/g,''))} maxLength={11} required />
          {errors.cpf && <div className="error-message">{errors.cpf}</div>}

          <label htmlFor="rg">RG</label>
          <input id="rg" className={inputClass('rg')} value={read('rg')} onChange={(e)=> write('rg', e.target.value)} required />
          {errors.rg && <div className="error-message">{errors.rg}</div>}

          <label htmlFor="password-register">Senha</label>
          <input id="password-register" className={inputClass('password')} type="password" value={read('password')} onChange={(e)=> write('password', e.target.value)} required />
          {errors.password && <div className="error-message">{errors.password}</div>}

          <label htmlFor="role">Perfil</label>
          <select id="role" className={inputClass('role')} value={read('role')} onChange={(e)=> write('role', e.target.value)} required>
            <option value="">Selecione...</option>
            <option value="produtor">Produtor</option>
            <option value="estudante">Estudante</option>
            <option value="tecnico">Técnico</option>
            <option value="empreendedor">Empreendedor</option>
            <option value="pesquisador">Pesquisador</option>
          </select>
          {errors.role && <div className="error-message">{errors.role}</div>}

          <div className="actions" style={{ marginTop: 10 }}>
            <button type="submit" className="btn">Cadastrar</button>
            <a href="#" className="muted" style={{ alignSelf: 'center' }}>Política de privacidade</a>
          </div>

          {errors.submit && <div className="error-message" style={{ marginTop: 8 }}>{errors.submit}</div>}

          <footer style={{ marginTop: 14 }}>
            Já tem uma conta?{' '}
            <a href="#" className="link" onClick={(e) => { e.preventDefault(); if (typeof openLogin === 'function') return openLogin(); }}>
              Entrar
            </a>
          </footer>
        </form>
      </div>
    </div>
  );
}
