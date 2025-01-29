import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import './../style/Pagamento.css'

const validarNumeroCartao = (numeroCartao) => {
  let arr = (numeroCartao + '')
    .split('')
    .reverse()
    .map(x => parseInt(x));
  let sum = arr.reduce((acc, val, i) =>
    i % 2 !== 0 ? acc + ((val * 2 > 9) ? val * 2 - 9 : val * 2) : acc + val, 0);
  return sum % 10 === 0;
};

const Pagamento = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [dadosCartao, setDadosCartao] = useState({
    numero: '',
    nome: '',
    validade: '',
    cvv: ''
  });
  const [cartaoValido, setCartaoValido] = useState(null);

  useEffect(() => {
    if (!state) {
      navigate('/'); // Caso os dados não sejam passados corretamente, redireciona para a página inicial
    }
  }, [state, navigate]);

  const handlePagamento = () => {
    if (metodoPagamento === '') {
      alert('Por favor, selecione um método de pagamento.');
    } else if (
      (metodoPagamento === 'Cartão de Crédito' || metodoPagamento === 'Cartão de Débito') &&
      (!dadosCartao.numero || !dadosCartao.nome || !dadosCartao.validade || !dadosCartao.cvv)
    ) {
      alert('Por favor, preencha todos os dados do cartão.');
    } else if (
      (metodoPagamento === 'Cartão de Crédito' || metodoPagamento === 'Cartão de Débito') &&
      !cartaoValido
    ) {
      alert('Número de cartão inválido.');
    } else {
      alert(`Pagamento com ${metodoPagamento} no valor de R$ ${state.valorTotal.toFixed(2)} realizado com sucesso!`);

      navigate('/pagamento-confirmado', {
        state: state // Passa os dados de volta para a tela de confirmação
      });
    }
  };

  const handleVoltar = () => {
    navigate(-1); // Navega para a página anterior
  };

  const handleNumeroCartaoChange = (e) => {
    const valor = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatado = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
    setDadosCartao({ ...dadosCartao, numero: formatado });
    setCartaoValido(validarNumeroCartao(valor));
  };

  const handleValidadeChange = (e) => {
    const valor = e.target.value.replace(/\D/g, '').slice(0, 4);
    const formatado = valor.replace(/(\d{2})(?=\d)/g, '$1/');
    setDadosCartao({ ...dadosCartao, validade: formatado });
  };

  const handleCvvChange = (e) => {
    const valor = e.target.value.replace(/\D/g, '').slice(0, 3);
    setDadosCartao({ ...dadosCartao, cvv: valor });
  };

  const handleNomeChange = (e) => {
    const valor = e.target.value.toUpperCase();
    setDadosCartao({ ...dadosCartao, nome: valor });
  };

  return (
    <div className="pagamento-container">
      <div className="header-seguranca">
        <FaLock className="icon-lock" />
        <p>Pagamento 100% seguro</p>
      </div>

      <h2>Pagamento</h2>
      <p className="valor-total"><strong>Valor Total:</strong> R$ {state.valorTotal.toFixed(2)}</p>

      <div className="metodo-pagamento">
        <h3>Selecione o método de pagamento:</h3>
        <div>
          <label>
            <input
              type="radio"
              value="PIX"
              checked={metodoPagamento === 'PIX'}
              onChange={() => setMetodoPagamento('PIX')}
            />
            PIX
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="Cartão de Crédito"
              checked={metodoPagamento === 'Cartão de Crédito'}
              onChange={() => setMetodoPagamento('Cartão de Crédito')}
            />
            Cartão de Crédito
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="Cartão de Débito"
              checked={metodoPagamento === 'Cartão de Débito'}
              onChange={() => setMetodoPagamento('Cartão de Débito')}
            />
            Cartão de Débito
          </label>
        </div>
      </div>

      {/* Formulário de cartão de crédito/débito */}
      {(metodoPagamento === 'Cartão de Crédito' || metodoPagamento === 'Cartão de Débito') && (
        <div className="dados-cartao">
          <h3>Insira os dados do cartão:</h3>
          <div>
            <label>Número do Cartão:</label>
            <input
              type="text"
              name="numero"
              value={dadosCartao.numero}
              onChange={handleNumeroCartaoChange}
              placeholder="1234 5678 9123 0000"
              maxLength="19"
            />
            {cartaoValido === false && <p className="erro-cartao">Número de cartão inválido.</p>}
          </div>
          <div>
            <label>Nome no Cartão:</label>
            <input
              type="text"
              name="nome"
              value={dadosCartao.nome}
              onChange={handleNomeChange}
              placeholder="NOME IMPRESSO NO CARTÃO"
            />
          </div>
          <div>
            <label>Validade:</label>
            <input
              type="text"
              name="validade"
              value={dadosCartao.validade}
              onChange={handleValidadeChange}
              placeholder="MM/AA"
              maxLength="5"
            />
          </div>
          <div>
            <label>CVV:</label>
            <input
              type="text"
              name="cvv"
              value={dadosCartao.cvv}
              onChange={handleCvvChange}
              placeholder="CVV"
              maxLength="3"
            />
          </div>
        </div>
      )}

      <button className="confirmar-btn" onClick={handlePagamento}>
        Confirmar Pagamento
      </button>
      <button className="voltar-btn" onClick={handleVoltar}>
        Voltar
      </button>
    </div>
  );
};

export default Pagamento;
