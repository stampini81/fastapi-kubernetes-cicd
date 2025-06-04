proximos passo

pegar tudo que o thiago ensinou e passou e ja com o Jenkins na maquina instalado agora vamos ter que subir essa pequena aplicação

aqui deixei pistas para descubrir como subir a aplicação

------

<!DOCTYPE html>
<html lang="pt-BR">

<body>
  <h1>Desafio DevOps com FastAPI e React 🚀</h1>

  <p>Este projeto tem como objetivo integrar <strong>um backend em FastAPI</strong> com <strong>um frontend em React</strong>, além de configurar CI/CD usando <strong>Jenkins</strong> e <strong>Kubernetes</strong> (via Rancher ou Minikube). É uma oportunidade de aprender na prática como criar, containerizar, automatizar e orquestrar aplicações modernas!</p>

  <h2>🎯 Desafio</h2>

  <h3>1️⃣ Backend - FastAPI</h3>
  <ul>
    <li>Crie 7 endpoints no backend:
      <ul>
        <li><code>/color</code> — Retorna uma cor aleatória para o fundo da página.</li>
        <li><code>/cat</code> — Retorna uma imagem aleatória de gato.</li>
        <li><code>/random-photo</code> — Retorna uma foto aleatória (ex.: via Picsum).</li>
        <li><code>/time</code> — Retorna o horário atual do servidor.</li>
        <li><code>/joke</code> — Redireciona para uma piada (use uma API pública).</li>
        <li><code>/scare</code> — Retorna uma imagem de susto (ex.: GIF).</li>
        <li><code>/lookalike</code> — Retorna uma imagem aleatória de “sósia”.</li>
      </ul>
    </li>
    <li>Adicione suporte a <strong>CORS</strong> no FastAPI para permitir requisições do frontend.</li>
  </ul>

  <h3>2️⃣ Frontend - React</h3>
  <ul>
    <li>Crie uma interface simples que:
      <ul>
        <li>Mostra a cor de fundo retornada pelo backend.</li>
        <li>Exibe a imagem aleatória de gato.</li>
        <li>Exibe a foto aleatória.</li>
        <li>Mostra o horário atual.</li>
        <li>Inclui um botão “Susto” para exibir a imagem de susto.</li>
        <li>Inclui um botão “Sósia” para exibir a imagem aleatória de “quem parece com você”.</li>
      </ul>
    </li>
  </ul>

  <h3>3️⃣ Containerização</h3>
  <ul>
    <li>Crie um <code>Dockerfile</code> para o backend.</li>
    <li>Crie um <code>Dockerfile</code> para o frontend.</li>
    <li>Suba as imagens no <strong>Docker Hub</strong> ou outro registry.</li>
  </ul>

  <h3>4️⃣ Integração com Jenkins</h3>
  <ul>
    <li>Configure um <code>Jenkinsfile</code> para:
      <ul>
        <li>Buildar as imagens Docker do backend e frontend.</li>
        <li>Fazer push das imagens para o registry.</li>
        <li>Aplicar os manifests no Kubernetes.</li>
      </ul>
    </li>
  </ul>

  <h3>5️⃣ Orquestração com Kubernetes</h3>
  <ul>
    <li>Crie manifestos Kubernetes para:
      <ul>
        <li>Deployments para backend e frontend.</li>
        <li>Services para backend e frontend.</li>
        <li>(Opcional) Um Ingress para rotear tudo bonitinho.</li>
      </ul>
    </li>
  </ul>

  <h2>🚀 Entregáveis</h2>
  <ul>
    <li>✅ Backend funcional no FastAPI.</li>
    <li>✅ Frontend React consumindo os endpoints.</li>
    <li>✅ Dockerfiles para cada app.</li>
    <li>✅ Jenkinsfile com pipeline CI/CD.</li>
    <li>✅ Deploy no Kubernetes local (Minikube ou Rancher).</li>
  </ul>

  <h2>💡 Dicas</h2>
  <ul>
    <li>Use <code>uvicorn</code> com <code>--reload</code> no backend para desenvolver mais rápido.</li>
    <li>Use <code>serve</code> para servir o build do React.</li>
    <li>Para CORS, habilite todas as origens para dev (<code>allow_origins=["*"]</code>).</li>
    <li>Use <code>kubectl apply -f</code> ou a interface do Rancher para aplicar os manifests.</li>
    <li>Divirta-se — e assuste seus colegas com o endpoint <code>/scare</code>! 😱</li>
  </ul>

  <h2>📦 Estrutura sugerida</h2>
  <pre><code>projeto-pb-automate/
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
└── Jenkinsfile
  </code></pre>

  <h2>📝 Como rodar localmente</h2>

  <h3>Backend</h3>
  <pre><code>cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000</code></pre>

  <h3>Frontend</h3>
  <pre><code>cd frontend
npm install
npm start</code></pre>

  <p><strong>Acesse:</strong></p>
  <ul>
    <li>Frontend: <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></li>
    <li>Backend: <a href="http://localhost:8000" target="_blank">http://localhost:8000</a></li>
  </ul>

  <h2>🚨 Boa sorte e bom código! 🚨</h2>
</body>
</html>
