import React, { useState } from 'react';
import axios from 'axios';
import './../style/RegistroCliente.css';

const FormularioRegistroCliente = () => {
  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    complemento: '',
    numero: '',
    dataNascimento: '',
    senha: '',
    confirmaSenha: '',
    codigoVerificacao: '',
    pontoPartida: '',
    sexo: '',
  });

  const [erro, setErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [aviso, setAviso] = useState('');
  const [codigoVerificacaoGerado, setCodigoVerificacaoGerado] = useState('');
  const [avisoCampo, setAvisoCampo] = useState({}); // Para avisos individuais de campo

  // Função para lidar com alterações nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cpf') {
      const cleanedCpf = value.replace(/\D/g, '');
      let formattedCpf = cleanedCpf;

      if (cleanedCpf.length <= 3) {
        formattedCpf = cleanedCpf;
      } else if (cleanedCpf.length <= 6) {
        formattedCpf = `${cleanedCpf.slice(0, 3)}.${cleanedCpf.slice(3)}`;
      } else if (cleanedCpf.length <= 9) {
        formattedCpf = `${cleanedCpf.slice(0, 3)}.${cleanedCpf.slice(3, 6)}.${cleanedCpf.slice(6)}`;
      } else {
        formattedCpf = `${cleanedCpf.slice(0, 3)}.${cleanedCpf.slice(3, 6)}.${cleanedCpf.slice(6, 9)}-${cleanedCpf.slice(9, 11)}`;
      }

      setFormData({ ...formData, cpf: formattedCpf });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === 'pontoPartida') {
      setAviso('Por favor, verifique se o ponto de partida está correto.');
    }
  };

  // Função para buscar endereço pelo CEP
  const buscarEndereco = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { uf, localidade, bairro, logradouro } = response.data;
      setFormData({
        ...formData,
        estado: uf,
        cidade: localidade,
        bairro: bairro,
        rua: logradouro,
      });
      setAvisoCampo((prevState) => ({ ...prevState, cep: '' }));
    } catch (error) {
      setAvisoCampo((prevState) => ({ ...prevState, cep: 'Erro ao buscar endereço. Verifique o CEP.' }));
    }
  };

  // Função para enviar código de verificação para o email
  const enviarCodigoVerificacao = async () => {
    try {
      const response = await axios.post('/api/enviar-codigo', { email: formData.email });
      setCodigoVerificacaoGerado(response.data.codigo); // Armazenar código gerado
      setCodigoEnviado(true);
      setErro('');
      setAviso('Código enviado! Verifique seu email.');
    } catch (error) {
      setErro('Erro ao enviar código de verificação. Tente novamente mais tarde.');
    }
  };

  // Função para validar senha forte
  const validarSenha = (senha) => {
    const regexSenha = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regexSenha.test(senha);
  };

  // Validação e envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cpf || !formData.nome || !formData.sobrenome || !formData.email || !formData.telefone || !formData.cep || !formData.dataNascimento || !formData.senha || !formData.confirmaSenha || !formData.codigoVerificacao || !formData.sexo) {
      setErro('Todos os campos são obrigatórios.');
      return;
    }

    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      setErro('CPF inválido.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErro('Email inválido.');
      return;
    }

    if (formData.senha !== formData.confirmaSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (!validarSenha(formData.senha)) {
      setErro('A senha deve ter pelo menos 8 caracteres e incluir letras, números e caracteres especiais.');
      return;
    }

    if (formData.codigoVerificacao !== codigoVerificacaoGerado) {
      setErro('Código de verificação inválido.');
      return;
    }

    // Exibir dados inseridos no alerta
    alert(JSON.stringify(formData, null, 2));

    try {
      const response = await axios.post('/api/registro', formData);
      setMensagemSucesso('Cadastro realizado com sucesso.');
      setErro('');
    } catch (error) {
      setErro('Ocorreu um erro ao tentar registrar. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="formulario-container">
      <h2>Registrar-se</h2>
      {erro && <div className="erro">{erro}</div>}
      {mensagemSucesso && <div className="sucesso">{mensagemSucesso}</div>}
      {aviso && <div className="aviso">{aviso}</div>}

      <form onSubmit={handleSubmit} className="formulario">
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={formData.cpf}
          onChange={handleChange}
        />
        {avisoCampo.cpf && <div className="aviso-campo">{avisoCampo.cpf}</div>}

        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={formData.nome}
          onChange={handleChange}
        />
        {avisoCampo.nome && <div className="aviso-campo">{avisoCampo.nome}</div>}

        <input
          type="text"
          name="sobrenome"
          placeholder="Sobrenome"
          value={formData.sobrenome}
          onChange={handleChange}
        />
        {avisoCampo.sobrenome && <div className="aviso-campo">{avisoCampo.sobrenome}</div>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {avisoCampo.email && <div className="aviso-campo">{avisoCampo.email}</div>}

        <div className="codigo-container">
          <button type="button" onClick={enviarCodigoVerificacao}>Enviar Código de Verificação</button>
          {codigoEnviado && (
            <div className="codigo-input">
              <input
                type="text"
                name="codigoVerificacao"
                placeholder="Código de Verificação"
                value={formData.codigoVerificacao}
                onChange={handleChange}
              />
              <button type="button" onClick={enviarCodigoVerificacao}>Confirmar Código</button>
            </div>
          )}
        </div>

        <select name="sexo" value={formData.sexo} onChange={handleChange}>
          <option value="">Seu sexo</option>
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
        </select>
        {avisoCampo.sexo && <div className="aviso-campo">{avisoCampo.sexo}</div>}

        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={formData.telefone}
          onChange={handleChange}
        />

        <div className="cep-container">
          <input
            type="text"
            name="cep"
            placeholder="CEP"
            value={formData.cep}
            onChange={(e) => {
              handleChange(e);
              setAvisoCampo((prevState) => ({ ...prevState, cep: '' }));
            }}
          />
          <button type="button" onClick={() => buscarEndereco(formData.cep)}>Buscar</button>
        </div>
        {avisoCampo.cep && <div className="aviso-campo">{avisoCampo.cep}</div>}

        <input
          type="text"
          name="estado"
          placeholder="Estado"
          value={formData.estado}
          readOnly
        />
        <input
          type="text"
          name="cidade"
          placeholder="Cidade"
          value={formData.cidade}
          readOnly
        />
        <input
          type="text"
          name="bairro"
          placeholder="Bairro"
          value={formData.bairro}
          readOnly
        />
        <input
          type="text"
          name="rua"
          placeholder="Rua"
          value={formData.rua}
          readOnly
        />

        <input
          type="text"
          name="complemento"
          placeholder="Complemento"
          value={formData.complemento}
          onChange={handleChange}
        />

        <input
          type="text"
          name="numero"
          placeholder="Número"
          value={formData.numero}
          onChange={handleChange}
        />

        <label htmlFor="dataNascimento">Data de Nascimento</label>
        <input
          type="date"
          name="dataNascimento"
          placeholder="Data de Nascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
        />

        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={formData.senha}
          onChange={handleChange}
        />
        {formData.senha && formData.senha.length < 8 && <div className="aviso-campo">A senha deve ter pelo menos 8 caracteres.</div>}

        <input
          type="password"
          name="confirmaSenha"
          placeholder="Confirmar Senha"
          value={formData.confirmaSenha}
          onChange={handleChange}
        />

        <select name="pontoPartida" onChange={handleChange}>
          <option value="">Selecione o ponto de partida</option>
          <option value="Capão">Capão</option>
          <option value="Gramadão">Gramadão</option>
          <option value="Gramadinho">Gramadinho</option>
          <option value="Itapeva">Itapeva</option>
          <option value="Itapetininga">Itapetininga</option>
          <option value="Sorocaba">Sorocaba</option>
          <option value="Taquari">Taquari</option>
        </select>

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default FormularioRegistroCliente;
