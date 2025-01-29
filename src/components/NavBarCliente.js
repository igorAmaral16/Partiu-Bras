import React, { useState, useEffect, useRef } from 'react';
import './../style/NavBarCliente.css';
import LoginModal from './../pages/Login';

const NavBarCliente = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userNameRef = useRef(null);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    setDropdownOpen(false);
  };

  const onLoginSuccess = (nomeUsuario) => {
    const usuarioObj = { nome: nomeUsuario };
    localStorage.setItem('usuario', JSON.stringify(usuarioObj));
    setUsuario(nomeUsuario);
  };

  useEffect(() => {
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      const usuarioObj = JSON.parse(usuarioJSON);
      setUsuario(usuarioObj.nome);
    }
  }, []);

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !userNameRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="logo">Partiu Brás</div>

      {!usuario ? (
        <button className="login-btn" onClick={openModal}>Entrar</button>
      ) : (
        <div className="user-info">
          <button 
            ref={userNameRef}
            className="user-name" 
            onClick={toggleDropdown}
          >
            {usuario}
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu" ref={dropdownRef}>
              <button onClick={() => alert('Meu Perfil')}>Meu Perfil</button>
              <button onClick={() => alert('Configurações')}>Configurações</button>
              <button onClick={() => alert('Modo Noturno')}>Modo Noturno</button>
              <button onClick={handleLogout}>Sair</button>
            </div>
          )}
        </div>
      )}

      {isModalOpen && <LoginModal closeModal={closeModal} onLoginSuccess={onLoginSuccess} />}
    </div>
  );
};

export default NavBarCliente;
