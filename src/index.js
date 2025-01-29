// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM.createRoot
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Atualização aqui
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
