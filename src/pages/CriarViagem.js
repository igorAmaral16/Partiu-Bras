import React, { useState, useEffect } from 'react';
import './../style/CriarViagem.css';
import NavBar from './../components/NavBar';
import Footer from './../components/Footer';

const CreateTrip = () => {
  const [cities, setCities] = useState([
    'Itapeva', 'Gramadão', 'Gramadinho', 'Capão', 'Taquari', 'Itapetininga', 'Sorocaba'
  ]);
  const [tripDate, setTripDate] = useState('');
  const [seats, setSeats] = useState(44);
  const [price, setPrice] = useState(150.00);
  const [error, setError] = useState('');
  const [selectedCities, setSelectedCities] = useState([
    'Itapeva', 'Gramadão', 'Gramadinho', 'Capão', 'Taquari', 'Itapetininga', 'Sorocaba'
  ]);

  // Função para calcular a próxima segunda ou sexta-feira
  const getNextWeekday = (weekday) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilNext = (weekday + 7 - dayOfWeek) % 7;
    today.setDate(today.getDate() + daysUntilNext);
    return today;
  };

  useEffect(() => {
    // Define a data da viagem como a próxima segunda ou sexta-feira
    const nextMonday = getNextWeekday(1);
    const nextFriday = getNextWeekday(5);
    const today = new Date();
    
    // Se a próxima segunda-feira for mais próxima, define essa data
    setTripDate(nextMonday > today ? formatDate(nextMonday) : formatDate(nextFriday));
  }, []);

  // Formatar data no formato DD/MM/AAAA
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Remover cidade da lista
  const removeCity = (cityToRemove) => {
    setSelectedCities(selectedCities.filter(city => city !== cityToRemove));
  };

  // Adicionar cidade à lista
  const addCity = (cityToAdd) => {
    if (!selectedCities.includes(cityToAdd)) {
      setSelectedCities([...selectedCities, cityToAdd]);
    }
  };

  // Função para enviar os dados ao back
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Preparar dados para envio
    const tripData = {
      cities: selectedCities,
      tripDate,
      time: '21:30', // Horário fixo
      price,
      seats,
    };

    try {
      const response = await fetch('/api/viagem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });

      if (response.ok) {
        alert('Viagem criada com sucesso!');
      } else {
        throw new Error('Erro ao criar viagem.');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="form-container">
        <form className="create-trip-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tripDate">Data da Viagem (DD/MM/AAAA)</label>
            <input
              type="text"
              id="tripDate"
              value={tripDate}
              onChange={(e) => setTripDate(e.target.value)}
              placeholder="DD/MM/AAAA"
              maxLength="10"
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="time">Horário de Partida</label>
            <input
              id="time"
              type="time"
              value="21:30"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Valor da Viagem</label>
            <input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Cidades</label>
            <div className="city-list">
              {selectedCities.map(city => (
                <div key={city} className="city-item">
                  <span>{city}</span>
                  <button type="button" onClick={() => removeCity(city)}>X</button>
                </div>
              ))}
            </div>
            <div className="available-cities">
              {cities.filter(city => !selectedCities.includes(city)).map(city => (
                <button type="button" key={city} onClick={() => addCity(city)}>{city}</button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="seats">Assentos Disponíveis</label>
            <input
              id="seats"
              type="number"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
            />
          </div>

          <button type="submit">Criar Viagem</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreateTrip;
