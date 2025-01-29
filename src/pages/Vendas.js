import React, { useState, useEffect } from 'react';
import NavBar from './../components/NavBar';
import Footer from './../components/Footer';
import './../style/Vendas.css';

const Vendas = () => {
  const [passages, setPassages] = useState([]);
  const [filteredPassages, setFilteredPassages] = useState([]);
  const [filterState, setFilterState] = useState('');
  const [filterDate, setFilterDate] = useState('');
  
  useEffect(() => {
    const fetchPassages = async () => {
      const simulatedPassages = [
        {
          id: 1,
          origem: 'São Paulo',
          destino: 'Campinas',
          horario: '15:30',
          data: '2025-01-25',
          assentosLivres: 20,
          assentosOcupados: 20,
          status: 'não confirmada',
        },
        {
          id: 2,
          origem: 'Rio de Janeiro',
          destino: 'Búzios',
          horario: '08:45',
          data: '2025-01-30',
          assentosLivres: 25,
          assentosOcupados: 15,
          status: 'confirmada',
        },
      ];
      setPassages(simulatedPassages);
      setFilteredPassages(simulatedPassages);
    };
    fetchPassages();
  }, []);

  // Função para confirmar a passagem (atualiza o status)
  const handleConfirm = (id) => {
    setPassages((prevPassages) =>
      prevPassages.map((passage) =>
        passage.id === id ? { ...passage, status: 'confirmada' } : passage
      )
    );
  };

  // Função para filtrar passagens por status ou data
  const filterPassages = () => {
    let filtered = passages;

    if (filterState) {
      filtered = filtered.filter((passage) => passage.status === filterState);
    }

    if (filterDate) {
      filtered = filtered.filter((passage) => passage.data === filterDate);
    }

    setFilteredPassages(filtered);
  };

  useEffect(() => {
    filterPassages();
  }, [filterState, filterDate]);

  return (
    <div>
      <NavBar />
      <div className="filter-container">
        <div>
          <label>Filtrar por Estado: </label>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="confirmada">Confirmada</option>
            <option value="não confirmada">Não Confirmada</option>
          </select>
        </div>

        <div>
          <label>Filtrar por Data: </label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      <div className="vendas-container">
        {filteredPassages.length > 0 ? (
          filteredPassages.map((passage) => (
            <div key={passage.id} className="passage-block">
              <div className="passage-info">
                <p><strong>Origem:</strong> {passage.origem}</p>
                <p><strong>Destino:</strong> {passage.destino}</p>
                <p><strong>Horário:</strong> {passage.horario}</p>
                <p><strong>Data:</strong> {passage.data}</p>
                <p><strong>Assentos Livres:</strong> {passage.assentosLivres}</p>
                <p><strong>Assentos Ocupados:</strong> {passage.assentosOcupados}</p>
              </div>
              <div className="passage-actions">
                {passage.status === 'não confirmada' ? (
                  <button onClick={() => handleConfirm(passage.id)}>
                    Confirmar
                  </button>
                ) : (
                  <button disabled>Confirmada</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Nenhuma passagem encontrada.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Vendas;
