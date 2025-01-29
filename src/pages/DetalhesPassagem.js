import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './../style/DetalhesPassagem.css';

const DetalhesPassagem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const passagens = [
    {
      id: 1,
      origem: 'Itapeva',
      destino: 'Brás, São Paulo',
      horario: '00:00',
      assentos: 44,
      valorPorAssento: 150.00,
      data: '2025-02-01',
      ocupados: [
        { assento: 1, sexo: 'homem' },
        { assento: 3, sexo: 'mulher' },
        { assento: 6, sexo: 'homem' },
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
        { assento: 4, sexo: 'mulher' },
        { assento: 5, sexo: 'mulher' },
        { assento: 6, sexo: 'mulher' },
      ]
    },
  ];

  const [passagem, setPassagem] = useState(null);
  const [selecionado, setSelecionado] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [acompanhantes, setAcompanhantes] = useState([]);
  const [novoAcompanhante, setNovoAcompanhante] = useState({
    nome: '',
    sobrenome: '',
    cidadePartida: '',
    rg: '',
    cpf: '',
    numeroAssento: '',
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [assentoRemover, setAssentoRemover] = useState(null);

  useEffect(() => {
    const trip = passagens.find((t) => t.id === parseInt(id));
    setPassagem(trip);
  }, [id]);

  useEffect(() => {
    if (passagem) {
      setValorTotal(selecionado.length * passagem.valorPorAssento);
    }
  }, [selecionado, passagem]);

  useEffect(() => {
    if (modalVisible) {
      setNovoAcompanhante({
        nome: '',
        sobrenome: '',
        cidadePartida: '',
        rg: '',
        cpf: '',
        numeroAssento: '',
      });
    }
  }, [modalVisible]);

  if (!passagem) {
    return <p>Passagem não encontrada.</p>;
  }

  const assentosOcupados = passagem.ocupados || [];
  const assentosDisponiveis = passagem.assentos - assentosOcupados.length;

  const handleAssentoClick = (assento) => {
    const assentoOcupado = assentosOcupados.find(o => o.assento === assento);

    if (assentoOcupado) {
      alert('Este assento já está ocupado.');
      return;
    }

    if (selecionado.includes(assento)) {
      // Remover assento da seleção
      setSelecionado(selecionado.filter(s => s !== assento));

      // Remover acompanhante associado ao assento
      const acompanhanteParaRemover = acompanhantes.find(acomp => acomp.numeroAssento === assento);
      if (acompanhanteParaRemover) {
        setAcompanhantes(acompanhantes.filter(acomp => acomp.numeroAssento !== assento));
        setValorTotal((prevTotal) => prevTotal - passagem.valorPorAssento);
      }
    } else if (selecionado.length < 5) {
      // Adicionar o assento à seleção
      setSelecionado([...selecionado, assento]);
    } else {
      alert('Você pode selecionar no máximo 5 assentos.');
    }

    salvarNoLocalStorage();
  };

  const handleAcompanhanteClick = (assento) => {
    if (selecionado.length === 0) {
      alert('Você deve selecionar pelo menos um assento antes de adicionar acompanhantes.');
      return;
    }

    const assentoOcupado = assentosOcupados.find(o => o.assento === assento);
    if (assentoOcupado) {
      alert('Este assento já está ocupado.');
      return;
    }

    if (acompanhantes.some(acomp => acomp.numeroAssento === assento)) {
      setAlertVisible(true);
      setAssentoRemover(assento);
    } else {
      setNovoAcompanhante({
        nome: '',
        sobrenome: '',
        cidadePartida: '',
        rg: '',
        cpf: '',
        numeroAssento: assento,
      });
      setModalVisible(true);
    }
  };

  const handleContinuar = () => {
    if (selecionado.length === 0) {
      alert('Selecione pelo menos um assento para continuar.');
    } else {
      navigate('/pagamento', {
        state: {
          valorTotal,
          passagem,
          selecionado,
          acompanhantes
        }
      });
    }
  };

  const handleSalvarAcompanhante = () => {
    const { nome, sobrenome, numeroAssento } = novoAcompanhante;

    if (nome && sobrenome && numeroAssento && !selecionado.includes(Number(numeroAssento))) {
      // Criando o acompanhante com o número do assento associado
      const acompanhanteComAssento = {
        ...novoAcompanhante,
        numeroAssento: Number(numeroAssento), // Garantir que o assento seja vinculado corretamente
      };

      // Adicionando o acompanhante com o assento associado
      setAcompanhantes([...acompanhantes, acompanhanteComAssento]);

      // Atualizando os assentos selecionados e o valor total
      setSelecionado([...selecionado, Number(numeroAssento)]);
      setValorTotal((prevTotal) => prevTotal + passagem.valorPorAssento);

      // Fechando o modal e salvando no LocalStorage
      setModalVisible(false);
      salvarNoLocalStorage();
    } else {
      alert('Escolha um assento livre e não selecionado');
    }
  };

  const handleRemoverAcompanhante = (assento) => {
    const acompanhante = acompanhantes.find(acomp => acomp.numeroAssento === assento);

    setValorTotal((prevTotal) => prevTotal - passagem.valorPorAssento);
    setAcompanhantes(acompanhantes.filter(acomp => acomp.numeroAssento !== assento));
    setSelecionado(selecionado.filter(s => s !== assento));
    setAlertVisible(false);
  };

  const gerarAssentos = (quantidadeAssentos, assentosOcupados) => {
    const assentosSequenciais = Array.from({ length: 44 }, (_, index) => index + 1);
    let assentos = assentosSequenciais.map((assentoNumero) => {
      const isOcupado = assentosOcupados.find(o => o.assento === assentoNumero);
      return {
        numero: assentoNumero,
        ocupado: isOcupado ? true : false,
        sexo: isOcupado ? assentosOcupados.find(o => o.assento === assentoNumero).sexo : null,
      };
    });

    const fileiras = [
      [1, 2, null, 3, 4],
      [5, 6, null, 'ESCADA'],
      [7, 8, null, 9, 10],
      [11, 12, null, 13, 14],
      [15, 16, null, 17, 18],
      [19, 20, null, 21, 22],
      [23, 24, null, 25, 26],
      [27, 28, null, 29, 30],
      [31, 32, null, 33, 34],
      [35, 36, null, 37, 38],
      [39, 40, null, 41, 42],
      [43, 44, null, 'BANHEIRO'],
    ];

    return fileiras.map(fileira => fileira.map(assento => {
      if (typeof assento === 'number') return assentos[assento - 1];
      return assento;
    }));
  };

  const salvarNoLocalStorage = () => {
    const dadosPassagem = {
      passagem: passagem,
      selecionado: selecionado,
      acompanhantes: acompanhantes,
      valorTotal: valorTotal,
    };

    localStorage.setItem('dadosPassagem', JSON.stringify(dadosPassagem));
  };

  const assentosLayout = gerarAssentos(passagem.assentos, passagem.ocupados);

  // Função para validar RG (algoritmo de validação simples)
  function validarRG(rg) {
  // Remove caracteres não numéricos
  rg = rg.replace(/[^\d]+/g, '');

  // Verifica se o RG tem pelo menos 9 dígitos
  if (rg.length !== 9) return false;

  // Algoritmo de validação simples, apenas para verificar se o número é válido
  // Exemplo: 123456789

  // Verifica se o número do RG não é uma sequência de números repetidos, como 111111111
  if (/^(.)\1{8}$/.test(rg)) return false;

  return true;
}

  // Função para validar CPF utilizando o algoritmo de validação
  function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]+/g, '');

    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Valida os CPFs conhecidos como inválidos
    if (/^(000|111|222|333|444|555|666|777|888|999)\d{7}$/.test(cpf)) return false;

    // Valida o primeiro dígito verificador
    let soma = 0;
    let peso = 10;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * peso--;
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    // Valida o segundo dígito verificador
    soma = 0;
    peso = 11;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * peso--;
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  const handleInputChange = (e, tipo) => {
    const { value } = e.target;
    const numeroAssento = parseInt(value, 10);
  
    // Verifica se o valor atingiu o comprimento necessário para ser validado
    if (tipo === 'rg' && value.length >= 9) {
      if (validarRG(value)) {
        setNovoAcompanhante({ ...novoAcompanhante, rg: value });
      } else {
        alert('RG inválido');
      }
    } else if (tipo === 'cpf' && value.length >= 11) {
      if (validarCPF(value)) {
        setNovoAcompanhante({ ...novoAcompanhante, cpf: value });
      } else {
        alert('CPF inválido');
      }
    } else {
      // Atualiza os campos mesmo sem validação se o tamanho não for o suficiente
      if (tipo === 'rg') {
        setNovoAcompanhante({ ...novoAcompanhante, rg: value });
      } else if (tipo === 'cpf') {
        setNovoAcompanhante({ ...novoAcompanhante, cpf: value });
      }
    }
  };

  return (
    <div className="detalhes-container">
      <button className="btn-voltar" onClick={() => navigate('/')}>Voltar</button>

      <div className="informacoes-container">
        {/* Informações da Passagem */}
        <div className="informacoes-passagem">
          <h2>Informações da Passagem</h2>
          <div className="info">
            <p><strong>Origem:</strong> {passagem.origem}</p>
            <p><strong>Destino:</strong> {passagem.destino}</p>
            <p><strong>Data:</strong> {passagem.data}</p>
            <p><strong>Horário:</strong> {passagem.horario}</p>
            <p><strong>Valor por Assento:</strong> R$: {passagem.valorPorAssento.toFixed(2)}</p>
          </div>
        </div>
      </div>
      {/* Alerta garrafal */}
      <div className="alerta-info">
        ATENÇÃO: HOMENS E MULHERES NÃO PODEM ESCOLHER SENTAR-SE AO LADO DE ALGUÉM DO SEXO OPOSTO.
      </div>

      <div className="adicionar-acompanhante">
        <button
          className='btn-acompanhante'
          onClick={() => setModalVisible(true)}
          disabled={selecionado.length === 0}
        >
          Adicionar Acompanhante (+): R${passagem.valorPorAssento.toFixed(2)}
        </button>
      </div>

      {/* Legenda */}
      <div className="legenda-container">
        <div className="legenda-item">
          <span className="legenda-cor legenda-rosa"></span> Mulher
        </div>
        <div className="legenda-item">
          <span className="legenda-cor legenda-azul"></span> Homem
        </div>
        <div className="legenda-item">
          <span className="legenda-cor legenda-branco"></span> Livre
        </div>
        <div className="legenda-item">
          <span className="legenda-cor legenda-verde"></span> Selecionado
        </div>
      </div>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Adicionar Acompanhante</h2>
            <form className="modal-form">
              <div className="form-row">
                <label>Nome:
                  <input
                    type="text"
                    value={novoAcompanhante.nome}
                    onChange={(e) => {
                      const nome = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Apenas letras
                      setNovoAcompanhante({ ...novoAcompanhante, nome });
                    }}
                    required
                  />
                </label>
                <label>Sobrenome:
                  <input
                    type="text"
                    value={novoAcompanhante.sobrenome}
                    onChange={(e) => {
                      const sobrenome = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Apenas letras
                      setNovoAcompanhante({ ...novoAcompanhante, sobrenome });
                    }}
                    required
                  />
                </label>
              </div>
              <div className="form-row">
                <label>Cidade de Partida:
                  <select
                    value={novoAcompanhante.cidadePartida}
                    onChange={(e) => setNovoAcompanhante({ ...novoAcompanhante, cidadePartida: e.target.value })}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="Capão">Capão</option>
                    <option value="Gramadão">Gramadão</option>
                    <option value="Gramadinho">Gramadinho</option>
                    <option value="Itapeva">Itapeva</option>
                    <option value="Itapetininga">Itapetininga</option>
                    <option value="Sorocaba">Sorocaba</option>
                    <option value="Taquari">Taquari</option>
                  </select>
                </label>
                <label>RG:
                  <input
                    type="text"
                    value={novoAcompanhante.rg}
                    onChange={(e) => handleInputChange(e, 'rg')}
                    required
                  />
                </label>
              </div>
              <div className="form-row">
                <label>CPF:
                  <input
                    type="text"
                    value={novoAcompanhante.cpf}
                    onChange={(e) => handleInputChange(e, 'cpf')}
                    required
                  />
                </label>
                <label>Assento:
                  <input
                    type="number"
                    value={novoAcompanhante.numeroAssento}
                    onChange={(e) => {
                      const numeroAssento = parseInt(e.target.value, 10);
                      if (numeroAssento >= 1 && numeroAssento <= 44) {
                        setNovoAcompanhante({ ...novoAcompanhante, numeroAssento });
                      } else {
                        alert('Número de assento deve ser entre 1 e 44.');
                      }
                    }}
                    required
                  />
                </label>
              </div>
              <div className="form-row">
                <label>Sexo:
                  <select
                    value={novoAcompanhante.sexo}
                    onChange={(e) => setNovoAcompanhante({ ...novoAcompanhante, sexo: e.target.value })}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="homem">Homem</option>
                    <option value="mulher">Mulher</option>
                  </select>
                </label>
              </div>
            </form>
            <div className="modal-buttons">
              <button onClick={() => setModalVisible(false)}>Fechar</button>
              <button onClick={handleSalvarAcompanhante}>Salvar</button>
            </div>
          </div>
        </div>
      )}
      <div className="assentos-container">
        <div className="assentos-grid">
          {assentosLayout.map((fileira, fileiraIndex) => (
            <div key={fileiraIndex} className="fileira">
              {fileira.map((assento, assentoIndex) => {
                if (assento === null) {
                  return <div key={assentoIndex} className="corredor" />;
                } else if (typeof assento === 'string') {
                  return (
                    <span key={assentoIndex} className={`assento ${assento}`}>
                      {assento}
                    </span>
                  );
                } else {
                  const isAcompanhante = acompanhantes.some(acomp => acomp.numeroAssento === assento.numero);
                  return (
                    <span
                      key={assentoIndex}
                      className={`assento
    ${assento.ocupado ? (assento.sexo === 'homem' ? 'ocupado-homem' : 'ocupado-mulher') :
                          (selecionado.includes(assento.numero) || isAcompanhante ? 'selecionado' : 'livre')}`}
                      onClick={() => !assento.ocupado && handleAssentoClick(assento.numero)}
                      onDoubleClick={() => handleAcompanhanteClick(assento.numero)}
                    >
                      {assento.numero}
                    </span>

                  );
                }
              })}
            </div>
          ))}
        </div>
      </div>

      <button
        className={`botao-flutuante ${selecionado.length > 0 && !modalVisible ? '' : 'hidden'}`}
        onClick={handleContinuar}
        disabled={selecionado.length === 0}
      >
        Selecionar Assento e Pagar
      </button>

    </div>
  );
};

export default DetalhesPassagem;
