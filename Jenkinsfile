// Jenkinsfile
pipeline {
    agent any

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    // Constrói a imagem Docker. A tag usa o BUILD_ID do Jenkins.
                    // Substitua 'leandro282' pelo seu username EXATO do Docker Hub.
                    // O Dockerfile está em 'backend/Dockerfile' e o contexto do build é 'backend/'.
                    docker.build("leandro282/projeto-kubernetes-pb-desafio-jenkins:${env.BUILD_ID}", "./backend")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Autentica no Docker Hub usando a credencial 'dockerhub' configurada no Jenkins.
                    // Empurra a imagem com a tag 'latest' e com a tag BUILD_ID.
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        docker.image("leandro282/projeto-kubernetes-pb-desafio-jenkins:${env.BUILD_ID}").push('latest')
                        docker.image("leandro282/projeto-kubernetes-pb-desafio-jenkins:${env.BUILD_ID}").push("${env.BUILD_ID}")
                    }
                }
            }
        }

        stage('Deploy no Kubernetes') {
            environment {
                // Define uma variável de ambiente para a BUILD_ID para usar no shell script
                tag_version = "${env.BUILD_ID}"
            }
            steps {
                // Usa a credencial 'kubeconfig' configurada no Jenkins para acessar o cluster Kubernetes.
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    // Substitui o placeholder {{tag}} no app-deploy.yaml pela tag da versão atual (BUILD_ID).
                    // O 'sed -i' edita o arquivo no local dentro do workspace do Jenkins.
                    sh "sed -i 's|{{tag}}|${tag_version}|g' ./k8s/app-deploy.yaml"

                    // Aplica o arquivo YAML modificado ao cluster Kubernetes.
                    sh 'kubectl apply -f k8s/app-deploy.yaml'

                    // Aguarda o rollout do Deployment para confirmar que foi bem-sucedido.
                    sh 'kubectl rollout status deployment/fastapi-app-deployment'
                }
            }
        }

        stage('Chuck Norris') {
            steps {
                // Adiciona o plugin Chuck Norris para exibir mensagens engraçadas.
                step([$class: 'CordellWalkerRecorder'])
            }
        }
    }
}
