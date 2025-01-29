import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem('userRole'); // Obter o papel do usuário autenticado

  if (!userRole || userRole !== role) {
    // Redireciona para a página 404 se o papel não corresponder
    return <Navigate to="/404" />;
  }

  return children;
};

export default ProtectedRoute;
