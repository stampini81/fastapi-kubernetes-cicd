pipeline {
    agent any

    triggers {
        githubPush() // Gatilho para disparar o pipeline por eventos de push do GitHub
    }

    stages {
        stage('Build Backend Docker Image') {
            steps {
                script {
                    docker.build("leandro282/projeto-kubernetes-pb-desafio-jenkins-backend:${env.BUILD_ID}", "./backend")
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    // CORREÇÃO AQUI: Mudar './frontend' para './front-end' (com hífen)
                    // E garantir que o nome da imagem não tenha '_old' se não for intencional
                    docker.build("leandro282/projeto-kubernetes-pb-desafio-jenkins-frontend:${env.BUILD_ID}", "./front-end")
                }
            }
        }

        stage('Push Backend Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        docker.image("leandro282/projeto-kubernetes-pb-desafio-jenkins-backend:${env.BUILD_ID}").push('latest')
                        docker.image("leandro282/projeto-kubernetes-pb-desafio-jenkins-backend:${env.BUILD_ID}").push("${env.BUILD_ID}")
                    }
                }
            }
        }

        stage('Push Frontend Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        // CORREÇÃO AQUI: Mudar para o nome da imagem correto (sem '_old')
                        docker.image("leandro282/projeto-kubernetes-pb-desafio-jenkins-frontend:${env.BUILD_ID}").push('latest')
                        docker.image("leandro282/projeto-kubernetes-pb-desafio-jenkins-frontend:${env.BUILD_ID}").push("${env.BUILD_ID}")
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            environment {
                BACKEND_TAG = "${env.BUILD_ID}"
                FRONTEND_TAG = "${env.BUILD_ID}"
            }
            steps {
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    // Substitui a tag da imagem do Backend no YAML do Backend
                    sh "sed -i 's|leandro282/projeto-kubernetes-pb-desafio-jenkins-backend:{{tag}}|leandro282/projeto-kubernetes-pb-desafio-jenkins-backend:${BACKEND_TAG}|g' ./k8s/backend-deployment.yaml"
                    
                    // CORREÇÃO AQUI: Ajustar o sed para o nome correto da imagem (sem '_old')
                    sh "sed -i 's|leandro282/projeto-kubernetes-pb-desafio-jenkins-frontend:{{tag}}|leandro282/projeto-kubernetes-pb-desafio-jenkins-frontend:${FRONTEND_TAG}|g' ./k8s/frontend-deployment.yaml"

                    sh 'kubectl apply -f k8s/backend-deployment.yaml'
                    sh 'kubectl rollout status deployment/fastapi-backend-deployment'

                    sh 'kubectl apply -f k8s/frontend-deployment.yaml'
                    sh 'kubectl rollout status deployment/react-frontend-deployment'
                }
            }
        }
    }
    post {
        always {
            step([$class: 'CordellWalkerRecorder'])
        }
    }
}