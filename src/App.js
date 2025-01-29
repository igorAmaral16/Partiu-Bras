import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ClienteHome from './pages/ClienteHome';
import ClienteHome2 from './pages/ClienteHome';
import HomeFuncionario from './pages/Home';
import RegistrarOnibus from './pages/RegistrarOnibus';
import CriarViagem from './pages/CriarViagem';
import Vendas from './pages/Vendas';
import Login from './pages/Login';
import RegistroCliente from './pages/RegistroCliente';
import DetalhesPassagem from './pages/DetalhesPassagem';
import Pagamento from './pages/Pagamento';
import PagamentoConfirmado from './pages/PagamentoConfirmado';
import NotFound from './components/404';
import ProtectedRoute from './routes/ProtectedRoutes';
import './style/global.css';

function App() {
  return (
    <Router basename="/novo_vendaPassagens">
      <Routes>
        <Route path="/" element={<ClienteHome />} />
        <Route path="/home-cliente" element={<ClienteHome2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registroCliente" element={<RegistroCliente />} />
        
        {/* Rotas protegidas para funcionários */}
        <Route 
          path="/home-funcionario" 
          element={
            <ProtectedRoute role="funcionario">
              <HomeFuncionario />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/registrar-onibus" 
          element={
            <ProtectedRoute role="funcionario">
              <RegistrarOnibus />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/criar-viagem" 
          element={
            <ProtectedRoute role="funcionario">
              <CriarViagem />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vendas" 
          element={
            <ProtectedRoute role="funcionario">
              <Vendas />
            </ProtectedRoute>
          } 
        />
        
        {/* Outras rotas */}
        <Route path="/detalhes/:id" element={<DetalhesPassagem />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/pagamento-confirmado" element={<PagamentoConfirmado />} />
        
        {/* Página 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Router>
  );
}

export default App;
