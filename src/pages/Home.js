import React, { useState, useEffect } from 'react';
import './../style/Home.css';
import NavBar from './../components/NavBar';
import Footer from './../components/Footer';

const Home = () => {
  const [data, setData] = useState([]); // Para armazenar os dados recebidos

  useEffect(() => {
    const fetchData = () => {
      const simulatedData = [
        { id: 1, title: 'Bloco 1', content: 'Conteúdo do bloco 1' },
        { id: 2, title: 'Bloco 2', content: 'Conteúdo do bloco 2' },
        { id: 3, title: 'Bloco 3', content: 'Conteúdo do bloco 3' },
        { id: 4, title: 'Bloco 4', content: 'Conteúdo do bloco 4' },
      ];
      setData(simulatedData);
    };

    fetchData();
  }, []);

  return (
    <div>
      <NavBar /> {/* Navbar fixa */}

      {/* Container de conteúdo */}
      <div className="content-container">
        {/* Mapear os dados para exibir os cards */}
        {data.map((item) => (
          <div key={item.id} className="content-block">
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
