## . Desafios Extras

    Para aprimorar ainda mais o projeto, considere os seguintes desafios:

    ### Scanner de Vulnerabilidades (Trivy)

    Para adicionar uma camada de segurança ao pipeline, foi integrado o [Trivy](https://aquasecurity.github.io/trivy/), um scanner de vulnerabilidades de imagem de contêiner. Ele verifica as imagens Docker por vulnerabilidades conhecidas em pacotes, dependências e configurações.

    **Integração no Pipeline:**

    Após a construção e o push das imagens Docker, um novo estágio é executado para escanear a imagem do backend (e opcionalmente o frontend). O pipeline será configurado para **falhar** se vulnerabilidades de severidade **ALTA** ou **CRÍTICA** forem detectadas, impedindo o deploy de imagens potencialmente inseguras para o cluster Kubernetes.

    **Comando no Jenkinsfile:**
    ```
    stage('Scan Vulnerabilities (Trivy)') {
        steps {
            script {
                sh "trivy image --severity HIGH,CRITICAL --exit-code 1 --format table --no-progress leandro282/projeto-kubernetes-pb-desafio-jenkins-backend:${env.BUILD_ID}"
                // Opcional: Para escanear a imagem do Frontend
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
    (Se vulnerabilidades forem encontradas, o formato da tabela mostrará os detalhes e o build falhará se `HIGH` ou `CRITICAL` estiverem presentes, devido ao `--exit-code 1`).

    

    * [Notificações (Slack/Discord)](#notificações-slackdiscord)
    * [Análise de Código Estática (SonarQube)](#análise-de-código-estática-sast-sonarqube)
    * [Helm Chart](#helm-chart)
    ```
