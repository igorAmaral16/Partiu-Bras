import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './../style/Login.css';

function Login({ closeModal, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.modal) {
      // Exibe o modal se o estado modal estiver presente
    }
  }, [location]);

  const handleLogin = async () => {
    setLoading(true);

    try {
      // Simulação de login do Funcionário
      if (email === 'funcionario@teste.com' && password === 'senha1234') {
        const usuario = { nome: "Funcionario" };
        localStorage.setItem("usuario", JSON.stringify(usuario)); // Armazena como objeto JSON
        localStorage.setItem("userRole", "funcionario");
        localStorage.setItem("funcionarioAuthenticated", "true");
        onLoginSuccess("Funcionario"); // Chama a função para o sucesso do login
        closeModal(); // Fecha o modal após o login
        navigate('/home-funcionario');

      // Simulação de login do João
      } else if (email === 'joao@teste.com' && password === 'senha1234') {
        const usuario = { nome: "João", sexo: "homem" };
        localStorage.setItem("usuario", JSON.stringify(usuario)); // Armazena como objeto JSON
        localStorage.setItem("userRole", "cliente");
        onLoginSuccess("João"); // Chama a função para o sucesso do login
        closeModal(); // Fecha o modal após o login

      // Simulação de login da Maria
      } else if (email === 'maria@teste.com' && password === 'senha1234') {
        const usuario = { nome: "Maria", sexo: "mulher" };
        localStorage.setItem("usuario", JSON.stringify(usuario)); // Armazena como objeto JSON
        localStorage.setItem("userRole", "cliente");
        onLoginSuccess("Maria"); // Chama a função para o sucesso do login
        closeModal(); // Fecha o modal após o login

      // Caso o login falhe
      } else {
        alert('Falha na autenticação');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao se conectar ao servidor');
    } finally {
      setLoading(false); // Para o spinner q não está funcionando (ainda)
    }
  };

  return (
    <div className="modal-overlay">
      <button className="close-button" onClick={closeModal}>X</button>
      <div className="modal-container">
        <h1 className="modal-title">Login</h1>
        <p className="modal-desc">Entre com seus dados para continuar.</p>
        <div className="modal-input">
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="modal-input">
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="modal-links">
          <a href="/forgot-password" className="forgot-password-link">Esqueci a senha</a>
          <Link to="/registroCliente" className="register-link" onClick={closeModal}>
            Registrar-se
          </Link>
        </div>
        <div className="modal-buttons">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <button className="modal-submit" onClick={handleLogin}>Entrar</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
