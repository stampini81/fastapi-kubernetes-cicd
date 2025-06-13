# Desafio DevOps com FastAPI e React 🚀

Este repositório contém um exemplo prático de como configurar um pipeline de Integração Contínua (CI) e Entrega Contínua (CD) utilizando Jenkins, Docker e Kubernetes rodando no **Windows Subsystem for Linux (WSL)**. A solução utiliza o **Docker Desktop** como ambiente de containerização e cluster Kubernetes local, e o **Docker Hub** para gerenciamento de imagens Docker. A automação dos builds é feita via GitHub Webhooks, seguindo conceitos de um fluxo de CI/CD.

## Sumário

1.  [🎯 Desafio](#-desafio)
    * [1️⃣ Backend - FastAPI](#1%EF%B8%8F%E2%83%A3-backend---fastapi)
    * [2️⃣ Frontend - React](#2%EF%B8%8F%E2%83%A3-frontend---react)
    * [3️⃣ Containerização](#3%EF%B8%8F%E2%83%A3-conteinerização)
    * [4️⃣ Integração com Jenkins](#4%EF%B8%8F%E2%83%A3-integração-com-jenkins)
    * [5️⃣ Orquestração com Kubernetes](#5%EF%B8%8F%E2%83%A3-orquestração-com-kubernetes)
2.  [🚀 Entregáveis](#-entregáveis)
3.  [💡 Dicas](#-dicas)
4.  [📦 Estrutura Sugerida](#-estrutura-sugerida)
5.  [📝 Como Rodar Localmente](#-como-rodar-localmente)
    * [Backend](#backend)
    * [Frontend](#frontend)
6.  [✅ Validações e Prints do Projeto](#-validações-e-prints-do-projeto)
    * [Fase de Conteinerização (Docker Hub)](#fase-de-conteinerização-docker-hub)
    * [Automação Jenkins (Commit e Push)](#automação-jenkins-commit-e-push)
    * [Deploy no Kubernetes](#deploy-no-kubernetes)
    * [Pipeline Jenkins Funcional](#pipeline-jenkins-funcional)



## 🎯 Desafio

### 1️⃣ Backend - FastAPI

* Crie 7 endpoints no backend:
    * `/color` — Retorna uma cor **aleatória** para o fundo da página.
    * `/cat` — Retorna uma imagem **aleatória** de gato.
    * `/random-photo` — Retorna uma foto **aleatória** (ex.: via Picsum).
    * `/time` — Retorna o horário atual do servidor.
    * `/joke` — Retorna uma piada (use uma API pública).
    * `/scare` — Retorna uma imagem de susto (ex.: GIF).
    * `/lookalike` — Retorna uma imagem **aleatória** de “sósia”.
* Adicione suporte a **CORS** no FastAPI para permitir requisições do frontend..
* **Adicional:** Inclua endpoints `/health` e `/ready` para verificações de saúde e prontidão, essenciais para orquestração com Kubernetes.

### 2️⃣ Frontend - React

* Crie uma interface simples que:
    * Mostra a cor de fundo retornada pelo backend.
    * Exibe a imagem aleatória de gato.
    * Exibe a foto aleatória.
    * Mostra o horário atual.
    * Inclui um botão “Susto” para exibir a imagem de susto.
    * Inclui um botão “Sósia” para exibir a imagem aleatória de “quem parece com você”.

### 3️⃣ Containerização

* Crie um `Dockerfile` para o backend.
* Crie um `Dockerfile` para o frontend.
* Suba as imagens no **Docker Hub** ou outro registry.

### 4️⃣ Integração com Jenkins

* Configure um `Jenkinsfile` para:
    * Buildar as imagens Docker do backend e frontend.
    * Fazer push das imagens para o registry.
    * Aplicar os manifests no Kubernetes.
    * Disparar o pipeline automaticamente via GitHub Webhooks.

### 5️⃣ Orquestração com Kubernetes

* Crie manifestos Kubernetes para:
    * Deployments para backend e frontend.
    * Services para backend e frontend.
    * (Opcional) Um Ingress para rotear tudo bonitinho.

## 🚀 Entregáveis

* ✅ Backend funcional em FastAPI.
* ✅ Frontend React consumindo os endpoints.
* ✅ Dockerfiles para cada app.
* ✅ Jenkinsfile com pipeline CI/CD.
* ✅ Deploy no Kubernetes local (Docker Desktop no WSL).

## 💡 Dicas

* Use `uvicorn` com `--reload` no backend para desenvolver mais rápido.
* Use `serve` para servir o build do React.
* Para CORS, habilite todas as origens para dev (`allow_origins=["*"]`).
* Use `kubectl apply -f` para aplicar os manifests.
* Divirta-se — e assuste seus colegas com o endpoint `/scare`! 😱

## 📦 Estrutura Sugerida
```

projeto-pb-automate/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── package.json
│   ├── src/
│   │   └── App.js
│   └── Dockerfile
│
├── k8s/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   └── frontend-service.yaml
│
└── Jenkinsfile
```

## 📝 Como Rodar Localmente

### Backend

**Localização:** `backend/`
**Conteúdo `main.py`:**
```python
from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import random
import httpx
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/color")
async def get_random_color():
    colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#33FFF3", "#FFDD33", "#33FFDD"]
    return {"cor": random.choice(colors)}

@app.get("/cat")
async def get_random_cat_image():
    async with httpx.AsyncClient() as client:
        response = await client.get("[https://api.thecatapi.com/v1/images/search](https://api.thecatapi.com/v1/images/search)")
        if response.status_code == 200:
            data = response.json()
            image_url = data[0]['url'] if data else "[https://via.placeholder.com/150/FF0000/FFFFFF?text=No+Cat+Found](https://via.placeholder.com/150/FF0000/FFFFFF?text=No+Cat+Found)"
            return {"cat_image_url": image_url}
        return JSONResponse(content={"error": "Failed to fetch cat image"}, status_code=response.status_code)

@app.get("/random-photo")
async def get_random_photo():
    width = random.randint(300, 800)
    height = random.randint(300, 800)
    photo_url = f"[https://picsum.photos/](https://picsum.photos/){width}/{height}"
    return {"random_photo_url": photo_url}

@app.get("/time")
async def get_current_time():
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {"current_time": now}

@app.get("/joke")
async def get_joke():
    async with httpx.AsyncClient() as client:
        response = await client.get("[https://official-joke-api.appspot.com/random_joke](https://official-joke-api.appspot.com/random_joke)")
        if response.status_code == 200:
            joke_data = response.json()
            joke_text = f"{joke_data.get('setup', '')} - {joke_data.get('punchline', '')}"
            return {"joke": joke_text}
        return JSONResponse(content={"error": "Failed to fetch joke"}, status_code=response.status_code)

@app.get("/scare")
async def scare():
    scare_images = [
        "[https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif](https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif)",
        "[https://media.giphy.com/media/26xBI73gWquCBBCDe/giphy.gif](https://media.giphy.com/media/26xBI73gWquCBBCDe/giphy.gif)",
        "[https://media.giphy.com/media/3o7TKr3nzgq5DlvmLt/giphy.gif](https://media.giphy.com/media/3o7TKr3nzgq5DlvmLt/giphy.gif)"
    ]
    random_scare = random.choice(scare_images)
    return {"scare_image_url": random_scare}

@app.get("/lookalike")
async def lookalike():
    lookalike_images = [
        "[https://randomuser.me/api/portraits/men/1.jpg](https://randomuser.me/api/portraits/men/1.jpg)",
        "[https://randomuser.me/api/portraits/women/1.jpg](https://randomuser.me/api/portraits/women/1.jpg)",
        "[https://randomuser.me/api/portraits/lego/1.jpg](https://randomuser.me/api/portraits/lego/1.jpg)",
        "[https://randomuser.me/api/portraits/thumb/men/75.jpg](https://randomuser.me/api/portraits/thumb/men/75.jpg)"
    ]
    random_lookalike = random.choice(lookalike_images)
    return {"lookalike_image_url": random_lookalike}

@app.get("/health")
async def health_check():
    """Verifica se a aplicação está em execução."""
    return {"status": "UP", "hostname": os.uname().nodename}

@app.get("/ready")
async def readiness_check(response: Response):
    """Verifica se a aplicação está pronta para receber tráfego."""
    is_ready = True
    if is_ready:
        response.status_code = 200
        return {"status": "READY", "hostname": os.uname().nodename}
    else:
        response.status_code = 503
        return {"status": "NOT READY", "hostname": os.uname().nodename}

@app.get("/")
async def read_root():
    return {"message": "Bem-vindo ao Desafio DevOps FastAPI + React!"}
```
## Conteúdo backend/requirements.txt:
```
fastapi
uvicorn[standard]
httpx
```
Conteúdo backend/Dockerfile:
```
FROM python:3.9-slim-buster
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EXPOSE 8000
```

## Navegue até o diretório raiz do seu projeto
```
 cd ~/projeto-kubernetes-pb-desafio-jenkins/
```
## Vá para a pasta backend
```
cd backend
```
## Instale o Python e pip no seu WSL (se necessário)
```
sudo apt update
sudo apt install python3 python3-pip python3.12-venv -y
```
## Crie e ative o ambiente virtual
```
python3 -m venv venv && source venv/bin/activate
```
## Instale as dependências
```
pip install -r requirements.txt --break-system-packages
```
## Execute a aplicação localmente com uvicorn
```
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
## Frontend

Localização: frontend/
## Conteúdo frontend/src/App.js:
```
import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'http://fastapi-backend-service:8000'
  : 'http://localhost:8000';

function App() {
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
```
## Conteúdo frontend/package.json:
```
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```
## Conteúdo frontend/public/index.html:
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FastAPI React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>

## Conteúdo frontend/src/index.js:

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
## Conteúdo frontend/Dockerfile:

## frontend/Dockerfile
```
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
## Conteúdo docker-compose.yaml (na raiz):
```
services:
  fastapi-app:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    restart: always

  react-frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    volumes:
      - ./frontend:/app
    depends_on:
      - fastapi-backend
    environment:
      REACT_APP_API_BASE_URL: http://fastapi-backend:8000
    restart: always
```
## Conteúdo k8s/app-deploy.yaml:

## k8s/app-deploy.yaml
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fastapi-app-deployment
  labels:
    app: fastapi-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: fastapi-app
  template:
    metadata:
      labels:
        app: fastapi-app
    spec:
      containers:
      - name: fastapi-container
        image: leandro282/projeto-kubernetes-pb-desafio-jenkins:{{tag}}
        ports:
        - containerPort: 8000
---
apiVersion: v1
kind: Service
metadata:
  name: fastapi-service
spec:
  selector:
    app: fastapi-app
  ports:
  - port: 80
    targetPort: 8000
    nodePort: 30001
  type: NodePort
```
## Conteúdo Jenkinsfile:
```
// Jenkinsfile
pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("leandro282/projeto-kubernetes-pb-desafio-jenkins:${env.BUILD_ID}", "./backend")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        docker.image("leandro282/projeto-kubernetes-pb-desafio-jenkins:${env.BUILD_ID}").push('latest')
                        docker.image("leandro282/projeto-kubernetes-pb-desafio-jenkins:${env.BUILD_ID}").push("${env.BUILD_ID}")
                    }
                }
            }
        }

        stage('Deploy no Kubernetes') {
            environment {
                tag_version = "${env.BUILD_ID}"
            }
            steps {
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh "sed -i 's|{{tag}}|${tag_version}|g' ./k8s/app-deploy.yaml"
                    sh 'kubectl apply -f k8s/app-deploy.yaml'
                    sh 'kubectl rollout status deployment/fastapi-app-deployment'
                }
            }
        }

        stage('Chuck Norris') {
            steps {
                step([$class: 'CordellWalkerRecorder'])
            }
        }
    }
}
```
