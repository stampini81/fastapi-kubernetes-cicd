    // Jenkinsfile (Trecho relevante)
    pipeline {
        agent any
        // ... (triggers) ...

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
                        // CORREÇÃO AQUI: Sintaxe correta para docker.build com buildArgs
                        docker.build("leandro282/projeto-kubernetes-pb-desafio-jenkins-frontend:${env.BUILD_ID}",
                                     // O segundo argumento é o caminho do contexto para o Dockerfile
                                     "./frontend_old",
                                     // O terceiro argumento é um mapa de opções nomeadas, incluindo buildArgs
                                     [buildArgs: [REACT_APP_API_BASE_URL: 'http://fastapi-backend-service:8000']]) // <<--- CORREÇÃO AQUI
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
                        sh "sed -i 's|leandro282/projeto-kubernetes-pb-desafio-jenkins-backend:{{tag}}|leandro282/projeto-kubernetes-pb-desafio-jenkins-backend:${BACKEND_TAG}|g' ./k8s/backend-deployment.yaml"
                        sh "sed -i 's|leandro282/projeto-kubernetes-pb-desafio-jenkins-frontend:{{tag}}|leandro282/projeto-kubernetes-pb-desafio-jenkins-frontend:${FRONTEND_TAG}|g' ./k8s/frontend-deployment.yaml"

                        sh 'kubectl apply -f k8s/backend-deployment.yaml'
                        sh 'kubectl rollout status deployment/fastapi-backend-deployment'

                        sh 'kubectl apply -f k8s/frontend-deployment.yaml'
                        sh 'kubectl rollout status deployment/react-frontend-deployment'
                    }
                }
            }

            stage('Chuck Norris') {
                steps {
                    step([$class: 'CordellWalkerRecorder'])
                }
            }
        }
        post {
            always {
                step([$class: 'CordellWalkerRecorder'])
            }
        }
    }
    