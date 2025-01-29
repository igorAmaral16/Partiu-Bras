import React, { useState } from 'react';
import './../style/RegistrarOnibus.css';
import NavBar from './../components/NavBar';
import Footer from './../components/Footer';

const RegistrarOnibus = () => {
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [quantidadeAssentos, setQuantidadeAssentos] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Futuramente, a lógica de envio para o banco de dados será implementada aqui
    console.log('Formulário enviado:', { placa, modelo, quantidadeAssentos });
    // Limpar o formulário após envio (pode ser removido quando o banco for implementado)
    setPlaca('');
    setModelo('');
    setQuantidadeAssentos('');
  };

  return (
    <div>
      <NavBar /> {/* Navbar fixa */}
      <div className="form-container">
        <h2>Registrar Ônibus</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="placa">Placa</label>
            <input
              type="text"
              id="placa"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              maxLength={7} // Limita a 7 caracteres
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="modelo">Modelo</label>
            <input
              type="text"
              id="modelo"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantidadeAssentos">Quantidade de Assentos</label>
            <input
              type="number"
              id="quantidadeAssentos"
              value={quantidadeAssentos}
              onChange={(e) => setQuantidadeAssentos(e.target.value)}
              min={1} // Garantir que seja um número inteiro positivo
              required
            />
          </div>

          <button type="submit">Registrar</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default RegistrarOnibus;
