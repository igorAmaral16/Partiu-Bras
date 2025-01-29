import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './../style/NavBar.css';
import logo from './../assets/logoPDF.png';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUsuario(null);
    navigate('/');
  };

  useEffect(() => {
    const usuarioJson = localStorage.getItem('usuario');
    if (usuarioJson) {
      try {
        const usuarioObj = JSON.parse(usuarioJson);
        if (usuarioObj && usuarioObj.nome) {
          setUsuario(usuarioObj.nome);
        }
      } catch (error) {
        console.error('Erro ao parsear o JSON do usuário:', error);
      }
    }
  }, []);

  return (
    <div className="navbar-fixed">
      <div className="navbar">
        <div className="navbar-left">
          <div className="hamburger" onClick={toggleMenu}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          <div className="logo-placeholder">
            <img src={logo} alt="Logo" className="navbar-logo" />
          </div>
        </div>
        <div className="navbar-right">
          {usuario ? (
            <div className="user-info">
              <span className="user-name">{usuario}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
        </div>
      </div>

      <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <ul>
          <li><Link to="/home-funcionario">Home</Link></li>
          <li><Link to="/criar-viagem">Criar Viagem</Link></li>
          <li><Link to="/vendas">Vendas</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
