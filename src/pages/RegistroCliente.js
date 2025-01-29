import React from 'react';
import { Link } from 'react-router-dom';
import FormularioRegistroCliente from '../components/FormularioRegistroCliente';
import './../style/RegistroCliente.css';

const RegistroCliente = () => {
  return (
    <div className="registro-container">
      <Link to="/" className="voltar-link">
        <span className="voltar-text">← Voltar</span>
      </Link>
      <FormularioRegistroCliente />
    </div>
  );
};

export default RegistroCliente;
