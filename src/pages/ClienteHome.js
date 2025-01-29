import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './../components/NavBarCliente';
import Footer from './../components/Footer';
import './../style/ClienteHome.css';
import LoginModal from './../pages/Login';

const initialTrips = [
  {
    id: 1,
    origem: 'Itapeva',
    destino: 'Brás, São Paulo',
    horario: '00:00',
    assentos: 44,
    valorPorAssento: 150.00,
    data: '2025-02-01',
    ocupados: [
      { assento: 1 },
      { assento: 3 },
      { assento: 6 },
    ]
  },
  {
    id: 2,
    origem: 'Itapeva',
    destino: 'Brás, São Paulo',
    horario: '03:00',
    assentos: 44,
    valorPorAssento: 150.00,
    data: '2025-02-05',
    ocupados: [
      { assento: 4 },
      { assento: 5 },
      { assento: 6 },
    ]
  },
  // ... outras viagens
];

const ClienteHome = () => {
  const navigate = useNavigate();
  const [passagens, setPassagens] = useState(initialTrips);
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [data, setData] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState(null);

  const filterTrips = () => {
    return passagens.filter(trip =>
      (origem ? trip.origem.toLowerCase().includes(origem.toLowerCase()) : true) &&
      (destino ? trip.destino.toLowerCase().includes(destino.toLowerCase()) : true) &&
      (data ? trip.data === data : true)
    );
  };

  const calcularAssentosDisponiveis = (trip) => {
    return trip.assentos - (trip.ocupados ? trip.ocupados.length : 0);
  };

  const openModal = (id) => {
    setSelectedTripId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const onLoginSuccess = (nomeUsuario) => {
    setUsuario(nomeUsuario);
    localStorage.setItem('usuario', nomeUsuario);
    setModalOpen(false);

    if (selectedTripId) {
      navigate(`/detalhes/${selectedTripId}`);
    } else {
      navigate('/home-cliente');
    }
  };

  const verDetalhesPassagem = (id) => {
    const nomeUsuario = localStorage.getItem('usuario');
    if (!nomeUsuario) {
      openModal(id);
    } else {
      navigate(`/detalhes/${id}`);
    }
  };

  useEffect(() => {
    const nomeUsuario = localStorage.getItem('usuario');
    if (nomeUsuario) {
      setUsuario(nomeUsuario);
    }
  }, []);

  const hasThreeCards = filterTrips().length === 3;

  return (
    <div className="home-container">
      <NavBar usuario={usuario} />

      <div className={`trips-list ${hasThreeCards ? 'three-cards' : ''}`}>
        {filterTrips().length > 0 ? (
          filterTrips().map((trip) => (
            <div className="trip-card" key={trip.id}>
              <h3>{trip.origem} - {trip.destino}</h3>
              <p>Horário: {trip.horario}</p>
              <p>Assentos disponíveis: {calcularAssentosDisponiveis(trip)}</p>
              <p>Data: {trip.data}</p>
              <button onClick={() => verDetalhesPassagem(trip.id)}>
                Ver Detalhes
              </button>
            </div>
          ))
        ) : (
          <p>Nenhuma passagem encontrada para os critérios selecionados.</p>
        )}
      </div>

      {isModalOpen && <LoginModal closeModal={closeModal} onLoginSuccess={onLoginSuccess} />}
      <Footer />
    </div>
  );
};

export default ClienteHome;
