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
                    docker.build("leandro282/projeto-kubernetes-pb-desafio-jenkins-frontend:${env.BUILD_ID}", "./frontend")
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
                    // Substitui a tag da imagem do Frontend no YAML do Frontend
                    sh "sed -i 's|leandro282/projeto-kubernetes-pb-desafio-jenkins-frontend:{{tag}}|leandro282/projeto-kubernetes-pb-desafio-jenkins-frontend:${FRONTEND_TAG}|g' ./k8s/frontend-deployment.yaml"

                    // Aplica os YAMLs do Backend
                    sh 'kubectl apply -f k8s/backend-deployment.yaml'
                    sh 'kubectl rollout status deployment/fastapi-backend-deployment'

                    // Aplica os YAMLs do Frontend
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