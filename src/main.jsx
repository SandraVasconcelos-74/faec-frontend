import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import AuthPage from './pages/AuthPage';
import './styles/Cadastro.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthPage />
  </React.StrictMode>
);

