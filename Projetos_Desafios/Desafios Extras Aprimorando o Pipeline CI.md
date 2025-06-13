# Desafios Extras: Aprimorando o Pipeline CI/CD

Esta seção detalha os desafios extras implementados para aprimorar o pipeline de CI/CD, adicionando funcionalidades de segurança, notificação, análise de código e orquestração avançada.

## Sumário

1.  [Scanner de Vulnerabilidades (Trivy)](#scanner-de-vulnerabilidades-trivy)
2.  [Notificações (Slack/Discord)](#notificações-slackdiscord)
3.  [Análise de Código Estática (SonarQube)](#análise-de-código-estática-sonarqube)
4.  [Helm Chart](#helm-chart)

---

## Scanner de Vulnerabilidades (Trivy)

Para adicionar uma camada de segurança ao pipeline, foi integrado o [Trivy](https://aquasecurity.github.io/trivy/), um scanner de vulnerabilidades de imagem de contêiner. Ele verifica as imagens Docker por vulnerabilidades conhecidas em pacotes, dependências e configurações.

**Integração no Pipeline:**

Após a construção e o push das imagens Docker, um novo estágio é executado para escanear a imagem do backend (e opcionalmente o frontend). O pipeline será configurado para **falhar** se vulnerabilidades de severidade **ALTA** ou **CRÍTICA** forem detectadas, impedindo o deploy de imagens potencialmente inseguras para o cluster Kubernetes.

**Passos para Configuração:**

1.  **Instalar Trivy no ambiente WSL (Agente Jenkins):**
    ```bash
    sudo apt update
    sudo apt install wget apt-transport-https gnupg -y
    wget -qO - [https://aquasecurity.github.io/trivy-repo/deb/public.key](https://aquasecurity.github.io/trivy-repo/deb/public.key) | sudo apt-key add -
    echo deb [https://aquasecurity.github.io/trivy-repo/deb/](https://aquasecurity.github.io/trivy-repo/deb/) $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list
    sudo apt update
    sudo apt install trivy -y
    ```
    *Verificar instalação: `trivy version`*

2.  **Adicionar Estágio de Scan no `Jenkinsfile`:**
    * Adicione este estágio logo após o estágio `Push Frontend Docker Image`.

    ```groovy
    // Jenkinsfile (Trecho relevante)
    stage('Scan Vulnerabilities (Trivy)') {
        steps {
            script {
                sh "trivy image --severity HIGH,CRITICAL --exit-code 1 --format table --no-progress leandro282/projeto-kubernetes-pb-desafio-jenkins-backend:${env.BUILD_ID}"
                // Opcional: Escanear a imagem do Frontend também
                // sh "trivy image --severity HIGH,CRITICAL --exit-code 1 --format table --no-progress leandro282/projeto-kubernetes-pb-desafio-jenkins-frontend:${env.BUILD_ID}"
            }
        }
    }
    ```

**Saída Esperada no Jenkins:**

No console de saída do Jenkins, você verá um relatório detalhado das vulnerabilidades encontradas (ou a mensagem de que nenhuma vulnerabilidade crítica foi detectada).

*Exemplo de saída de scan bem-sucedido (sem vulnerabilidades que causem falha):*
```
...
[Pipeline] stage
[Pipeline] { (Scan Vulnerabilities (Trivy))
[Pipeline] script
[Pipeline] {
[Pipeline] sh
+ trivy image --severity HIGH,CRITICAL --exit-code 1 --format table --no-progress leandro282/projeto-kubernetes-pb-desafio-jenkins-backend:BUILD_ID
2025-06-12T10:00:00Z INFO 
2025-06-12T10:00:00Z INFO Target: leandro282/projeto-kubernetes-pb-desafio-jenkins-backend:BUILD_ID (python 3.9.18)
2025-06-12T10:00:00Z INFO 
2025-06-12T10:00:00Z INFO No vulnerabilities found
...
Total: 0 (UNKNOWN: 0, LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0)

[Pipeline] }
[Pipeline] // script
[Pipeline] }
[Pipeline] // stage
...
```

---

## Notificações (Slack/Discord)

Para manter a equipe informada sobre o status do pipeline, foram configuradas notificações automáticas para o Slack (ou Discord). O Jenkins enviará uma mensagem informando o resultado do build (sucesso ou falha) e o link direto para o log do job.

**Integração no Pipeline:**

As notificações são adicionadas à seção `post` do `Jenkinsfile`, o que garante que elas sejam enviadas após a conclusão de todos os estágios do pipeline, independentemente do resultado.

**Passos para Configuração:**

1.  **Configurar Webhook no Discord (ou Slack):**
    * Abra seu servidor Discord e vá em **Configurações do Servidor > Integrações > Webhooks > Criar Webhook**.
    * Selecione um canal e **copie a "Webhook URL"**.
    * (Para Slack, acesse seu workspace, vá em "Apps" e procure por "Incoming WebHooks").

2.  **Instalar Plugin Jenkins:**
    * Vá para **Gerenciar Jenkins > Gerenciar Plugins**.
    * Na aba **Disponíveis**, procure por `Discord Notification` (ou `Slack Notification`). Instale-o.

3.  **Configurar Credenciais de Notificação no Jenkins:**
    * Vá para **Gerenciar Jenkins > Gerenciar Credenciais > Jenkins (store global)**.
    * Clique em **"+ Adicionar Credenciais"**.
    * **Tipo:** "Secret text".
    * **Secret:** Cole a **URL do Webhook** que você copiou do Discord/Slack.
    * **ID:** `discord-webhook-url` (ou `slack-webhook-url`).
    * Clique em **"Criar"**.

4.  **Adicionar Notificação ao `Jenkinsfile`:**
    * Adicione o seguinte bloco à seção `post` do seu `Jenkinsfile`.

    ```groovy
    // Jenkinsfile (Trecho relevante da seção 'post')
    post {
        // Envia notificação em caso de sucesso
        success {
            def jobUrl = "${env.JENKINS_URL}${env.JOB_NAME}/${env.BUILD_NUMBER}/"
            withCredentials([string(credentialsId: 'discord-webhook-url', variable: 'WEBHOOK_URL')]) {
                discordSend(webhookUrl: env.WEBHOOK_URL, message: "PROJETO CI/CD: Build #${env.BUILD_NUMBER} - SUCESSO! Aplicação atualizada. URL do Job: ${jobUrl}")
            }
        }
        // Envia notificação em caso de falha
        failure {
            def jobUrl = "${env.JENKINS_URL}${env.JOB_NAME}/${env.BUILD_NUMBER}/"
            withCredentials([string(credentialsId: 'discord-webhook-url', variable: 'WEBHOOK_URL')]) {
                discordSend(webhookUrl: env.WEBHOOK_URL, message: "PROJETO CI/CD: Build #${env.BUILD_NUMBER} - FALHA! Erro no pipeline. URL do Job: ${jobUrl}", color: '#FF0000')
            }
        }
        // Sempre executa, incluindo o Chuck Norris
        always {
            step([$class: 'CordellWalkerRecorder'])
        }
    }
    ```

---

## Análise de Código Estática (SonarQube)

Para garantir a qualidade e segurança do código, o [SonarQube](https://www.sonarqube.org/) será integrado ao pipeline. Ele realizará análises estáticas (SAST), identificando bugs, code smells e vulnerabilidades no código-fonte.

**Integração no Pipeline:**

Um novo estágio será adicionado para executar a análise do SonarQube após a etapa de scan de vulnerabilidades. O pipeline pode ser configurado para falhar se as "Quality Gates" do SonarQube não forem atendidas.

**Passos para Configuração:**

1.  **Subir SonarQube Localmente (via Docker Compose):**
    * Crie o arquivo `sonar-compose.yaml` na raiz do seu repositório:

    ```yaml
    # sonar-compose.yaml
    version: "3.8"
    services:
      sonarqube:
        image: sonarqube:lts-community
        ports:
          - "9000:9000"
        environment:
          - SONARQUBE_JDBC_URL=jdbc:postgresql://db:5432/sonar
          - SONARQUBE_JDBC_USERNAME=sonar
          - SONARQUBE_JDBC_PASSWORD=sonar
        volumes:
          - sonarqube_data:/opt/sonarqube/data
          - sonarqube_extensions:/opt/sonarqube/extensions
          - sonarqube_logs:/opt/sonarqube/logs
        depends_on:
          - db
        restart: always

      db:
        image: postgres:15-alpine
        environment:
          - POSTGRES_DB=sonar
          - POSTGRES_USER=sonar
          - POSTGRES_PASSWORD=sonar
        volumes:
          - postgresql_data:/var/lib/postgresql/data
        restart: always

    volumes:
      sonarqube_data:
      sonarqube_extensions:
      sonarqube_logs:
      postgresql_data:
    ```
    * Suba os serviços: `docker-compose -f sonar-compose.yaml up -d`
    * Acesse `http://localhost:9000` (login padrão `admin`/`admin`).

2.  **Configurar SonarQube para Análise de Python/JS (Plugins):**
    * No SonarQube (interface web), vá em **Administration > Marketplace**.
    * Procure por plugins de análise de código para **Python** e **JavaScript/TypeScript** e instale-os (se não vierem por padrão).

3.  **Gerar Token de Autenticação SonarQube:**
    * No SonarQube, vá em **My Account > Security**.
    * Gerar um novo token (ex: `jenkins-token`) e **COPIE-O**.

4.  **Configurar Jenkins para SonarQube:**
    * Instale o plugin **"SonarQube Scanner"** em **Gerenciar Jenkins > Gerenciar Plugins**.
    * Vá para **Gerenciar Jenkins > Configurar Sistema**.
    * Na seção "SonarQube servers", clique em "Add new SonarQube".
    * **Name:** `SonarQubeLocal`
    * **Server URL:** `http://localhost:9000`
    * **Authentication token:** Crie uma nova credencial "Secret text" com ID `sonarqube-token` e cole o token do SonarQube. Selecione esta credencial.

5.  **Adicionar Estágio no `Jenkinsfile`:**
    * Adicione o estágio `SonarQube Analysis` ao seu `Jenkinsfile`.

    ```groovy
    // Jenkinsfile (Trecho relevante)
    stage('SonarQube Analysis') {
        steps {
            script {
                withSonarQubeEnv(credentialsId: 'sonarqube-token', installationName: 'SonarQubeLocal') {
                    // Para o Backend (Python):
                    sh "sonar-scanner -Dsonar.projectKey=fastapi-app-devops-backend -Dsonar.sources=./backend -Dsonar.python.version=3.9"
                    // Para o Frontend (JavaScript/React):
                    // Certifique-se de que o SonarQube tem o plugin JS/TS e que você configurou cobertura se aplicável
                    // sh "sonar-scanner -Dsonar.projectKey=react-frontend-devops -Dsonar.sources=./frontend -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info"
                }
            }
        }
    }
    ```
6.  **Verificar Análise:** Após o build do Jenkins, acesse `http://localhost:9000` e procure pelo seu projeto (`fastapi-app-devops-backend`) para ver o relatório.

---

## Helm Chart

O [Helm](https://helm.sh/) é o gerenciador de pacotes para Kubernetes, que simplifica a definição, instalação e atualização de aplicações Kubernetes complexas. Este desafio envolve a criação de um Helm Chart para a sua aplicação e a sua implantação via Jenkins.

**Integração no Pipeline:**

O estágio de deploy no `Jenkinsfile` será adaptado para usar o Helm, substituindo a aplicação direta dos manifests `kubectl apply`.

**Passos para Configuração:**

1.  **Instalar Helm no WSL (Agente Jenkins):**
    ```bash
    sudo apt update
    curl [https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3) | bash
    ```
    *Verificar instalação: `helm version`*

2.  **Criar a Estrutura do Helm Chart:**
    * Na **raiz do seu repositório**, crie a pasta `charts/`.
    * Dentro dela, crie o chart: `helm create charts/my-app-chart`

3.  **Ajustar `Chart.yaml`:**
    * Edite `charts/my-app-chart/Chart.yaml` com metadados do seu projeto.

4.  **Ajustar `values.yaml`:**
    * Edite `charts/my-app-chart/values.yaml` para definir as variáveis configuráveis do seu projeto (nomes de imagem, tags, réplicas, portas).

    ```yaml
    # charts/my-app-chart/values.yaml
    backend:
      image:
        repository: leandro282/projeto-kubernetes-pb-desafio-jenkins-backend
        tag: latest # Será sobrescrito pelo Jenkins
      replicaCount: 2
      service:
        port: 80
        targetPort: 8000
        nodePort: 30001

    frontend:
      image:
        repository: leandro282/projeto-kubernetes-pb-desafio-jenkins-frontend
        tag: latest # Será sobrescrito pelo Jenkins
      replicaCount: 1
      service:
        port: 80
        targetPort: 80
        nodePort: 30000
    ```

5.  **Mover e Adaptar Manifestos para `templates/`:**
    * Mova seus arquivos `k8s/backend-deployment.yaml` e `k8s/frontend-deployment.yaml` (e seus respectivos Services) para `charts/my-app-chart/templates/`.
    * **Adapte-os para usar as variáveis do `values.yaml`** (ex: `image: "{{ .Values.backend.image.repository }}:{{ .Values.backend.image.tag }}"`).
    * **Remova a pasta `k8s/` original.**
    * **Exemplo de `backend-deployment.yaml` dentro de `templates/`:**
        ```yaml
        # charts/my-app-chart/templates/backend-deployment.yaml
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: fastapi-backend-deployment
          labels:
            app: fastapi-backend
        spec:
          replicas: {{ .Values.backend.replicaCount }}
          selector:
            matchLabels:
              app: fastapi-backend
          template:
            metadata:
              labels:
                app: fastapi-backend
            spec:
              containers:
              - name: fastapi-container
                image: "{{ .Values.backend.image.repository }}:{{ .Values.backend.image.tag }}"
                ports:
                - containerPort: {{ .Values.backend.service.targetPort }}
        ```
    * **Exemplo de `backend-service.yaml` dentro de `templates/`:**
        ```yaml
        # charts/my-app-chart/templates/backend-service.yaml
        apiVersion: v1
        kind: Service
        metadata:
          name: fastapi-backend-service
        spec:
          selector:
            app: fastapi-backend
          ports:
          - port: {{ .Values.backend.service.port }}
            targetPort: {{ .Values.backend.service.targetPort }}
            nodePort: {{ .Values.backend.service.nodePort }}
          type: {{ .Values.backend.service.type }}
        ```
    * **Exemplo de `frontend-deployment.yaml` dentro de `templates/`:**
        ```yaml
        # charts/my-app-chart/templates/frontend-deployment.yaml
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: react-frontend-deployment
          labels:
            app: react-frontend
        spec:
          replicas: {{ .Values.frontend.replicaCount }}
          selector:
            matchLabels:
              app: react-frontend
          template:
            metadata:
              labels:
                app: react-frontend
            spec:
              containers:
              - name: react-container
                image: "{{ .Values.frontend.image.repository }}:{{ .Values.frontend.image.tag }}"
                ports:
                - containerPort: {{ .Values.frontend.service.targetPort }}
        ```
    * **Exemplo de `frontend-service.yaml` dentro de `templates/`:**
        ```yaml
        # charts/my-app-chart/templates/frontend-service.yaml
        apiVersion: v1
        kind: Service
        metadata:
          name: react-frontend-service
        spec:
          selector:
            app: react-frontend
          ports:
          - protocol: TCP
            port: {{ .Values.frontend.service.port }}
            targetPort: {{ .Values.frontend.service.targetPort }}
            nodePort: {{ .Values.frontend.service.nodePort }}
          type: {{ .Values.frontend.service.type }}
        ```

6.  **Adicionar Estágio de Deploy com Helm no `Jenkinsfile`:**
    * Substitua o estágio `Deploy to Kubernetes` existente pelo `Deploy with Helm`.
    ```groovy
    // Jenkinsfile (Trecho relevante do estágio 'Deploy to Kubernetes')
    stage('Deploy with Helm') {
        environment {
            RELEASE_TAG = "${env.BUILD_ID}"
            HELM_RELEASE_NAME = "fastapi-react-app" # Nome do seu release Helm
            HELM_CHART_PATH = "./charts/my-app-chart" # Caminho para o seu chart Helm
        }
        steps {
            withKubeConfig([credentialsId: 'kubeconfig']) {
                sh "helm upgrade --install ${HELM_RELEASE_NAME} ${HELM_CHART_PATH} " +
                   "--namespace default " +
                   "--set backend.image.tag=${RELEASE_TAG} " +
                   "--set frontend.image.tag=${RELEASE_TAG} " +
                   "--set backend.replicaCount=2 " + # Exemplo de sobrescrita de replicas
                   "--atomic " + # Garante que a atualização seja atômica (rollback em falha)
                   "--wait"      # Espera o deploy completar antes de avançar
            }
        }
    }
    ```
7.  **Testar:** Faça um `git push` e verifique a implantação Helm com `helm list` e `kubectl get all -l app.kubernetes.io/instance=fastapi-react-app`.
