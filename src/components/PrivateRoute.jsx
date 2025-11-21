import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Verifica se existe o "crachá" (token) no navegador
  const token = sessionStorage.getItem('authToken');

  // Se tiver token, deixa passar (Outlet). Se não, manda pro Login.
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;