// frontend/src/App.js
import React, { useState, useEffect } from 'react';

// A API_BASE_URL será injetada como uma variável de ambiente durante o build do Docker.
// Ela será 'http://localhost:8000' para desenvolvimento local (via Docker Compose)
// e 'http://fastapi-backend-service:8000' para deploy no Kubernetes.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
  // Adicione estes logs para depuração
  console.log('API_BASE_URL sendo usada (App.js):', API_BASE_URL);
  console.log('Ambiente (process.env.NODE_ENV):', process.env.NODE_ENV); // Para ver o valor que o React vê

  const [color, setColor] = useState('white');
  const [catImage, setCatImage] = useState('');
  const [randomPhoto, setRandomPhoto] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [scareImage, setScareImage] = useState('');
  const [lookalikeImage, setLookalikeImage] = useState('');
  const [joke, setJoke] = useState('');
  const [backendStatus, setBackendStatus] = useState('Verificando...');

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`);
      const data = await response.json();
      console.log(`Dados recebidos para '${endpoint}':`, data);

      if (response.ok) {
        let valueToSet;
        if (endpoint === 'color') {
          valueToSet = data.cor;
        } else if (endpoint === 'cat') {
          valueToSet = data.cat_image_url;
        } else if (endpoint === 'random-photo') {
          valueToSet = data.random_photo_url;
        } else if (endpoint === 'time') {
          valueToSet = data.current_time;
        } else if (endpoint === 'joke') {
          valueToSet = data.joke;
        } else if (endpoint === 'scare') {
          valueToSet = data.scare_image_url;
        } else if (endpoint === 'lookalike') {
          valueToSet = data.lookalike_image_url;
        } else if (endpoint === 'health' || endpoint === 'ready') {
          valueToSet = data.status;
        }
        
        setter(valueToSet);
      } else {
        console.error(`Erro ao buscar '${endpoint}':`, data.detail || response.statusText);
        setter(`Erro ao carregar '${endpoint}'`);
      }
    } catch (error) {
      console.error(`Falha na requisição para '${endpoint}':`, error);
      setBackendStatus(`Backend OFFLINE (${endpoint} falhou)`);
    }
  };

  useEffect(() => {
    fetchData('color', setColor);
    fetchData('cat', setCatImage);
    fetchData('random-photo', setRandomPhoto);
    fetchData('time', setCurrentTime);
    fetchData('joke', setJoke); 
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        setBackendStatus(`Backend OK! (${data.status})`);
      } else {
        setBackendStatus(`Backend com erro: ${response.status}`);
      }
    } catch (error) {
      setBackendStatus('Backend OFFLINE');
    }
  };

  const updateRandomPhoto = () => fetchData('random-photo', setRandomPhoto);
  const updateCatImage = () => fetchData('cat', setCatImage);
  const updateColor = () => fetchData('color', setColor);
  const updateTime = () => fetchData('time', setCurrentTime);
  const updateJoke = () => fetchData('joke', setJoke);

  return (
    <div style={{ backgroundColor: color, minHeight: '100vh', padding: '20px', transition: 'background-color 0.5s ease' }}>
      <h1>Desafio DevOps FastAPI + React 🚀</h1>
      <p>Status do Backend: {backendStatus}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
        <div style={sectionStyle}>
          <h2>Cor de Fundo</h2>
          <p>Cor atual: {color}</p>
          <button onClick={updateColor}>Nova Cor</button>
        </div>

        <div style={sectionStyle}>
          <h2>Imagem de Gato</h2>
          {catImage && <img src={catImage} alt="Gato aleatório" style={{ maxWidth: '200px', maxHeight: '200px', display: 'block', margin: 'auto' }} />}
          <button onClick={updateCatImage}>Novo Gato</button>
        </div>

        <div style={sectionStyle}>
          <h2>Foto Aleatória</h2>
          {randomPhoto && <img src={randomPhoto} alt="Foto aleatória" style={{ maxWidth: '200px', maxHeight: '200px', display: 'block', margin: 'auto' }} />}
          <button onClick={updateRandomPhoto}>Nova Foto</button>
        </div>

        <div style={sectionStyle}>
          <h2>Horário Atual</h2>
          <p>{currentTime}</p>
          <button onClick={updateTime}>Atualizar Horário</button>
        </div>

        <div style={sectionStyle}>
          <h2>Piada</h2>
          <p>{joke}</p>
          <button onClick={updateJoke}>Nova Piada</button>
        </div>

        <div style={sectionStyle}>
          <h2>Susto 😱</h2>
          <button onClick={() => fetchData('scare', setScareImage)}>Mostrar Susto</button>
          {scareImage && <img src={scareImage} alt="Susto" style={{ maxWidth: '200px', maxHeight: '200px', display: 'block', margin: 'auto', marginTop: '10px' }} />}
        </div>

        <div style={sectionStyle}>
          <h2>Sósia 🧑‍🤝‍🧑</h2>
          <button onClick={() => fetchData('lookalike', setLookalikeImage)}>Encontrar Sósia</button>
          {lookalikeImage && <img src={lookalikeImage} alt="Sósia" style={{ maxWidth: '200px', maxHeight: '200px', display: 'block', margin: 'auto', marginTop: '10px' }} />}
        </div>
      </div>
    </div>
  );
}

const sectionStyle = {
  background: 'rgba(255, 255, 255, 0.8)',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  flex: '1 1 calc(33% - 40px)'
};

export default App;