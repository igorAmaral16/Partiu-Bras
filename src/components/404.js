import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    if (usuario === 'Funcionario') {
      localStorage.clear(); // Limpa dados de login
    }

    const timer = setTimeout(() => {
      navigate('/home-cliente');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h1>Erro 404 - Página não encontrada</h1>
      <p>Você será redirecionado para a página inicial do cliente em alguns segundos.</p>
    </div>
  );
};

export default NotFound;
