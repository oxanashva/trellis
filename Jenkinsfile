pipeline {
    agent { label 'built-in' }

    environment {
        DOCKER_HUB_USER = credentials('DOCKER_HUB_USER')

        // Compute short SHA safely inside a script block later
        IMAGE_NAME = "${DOCKER_HUB_USER}/trellis"

        VITE_API_URL = credentials('VITE_API_URL')
        VITE_CLOUD_NAME = credentials('VITE_CLOUD_NAME')

        RENDER_DEPLOY_HOOK = credentials('RENDER_DEPLOY_HOOK')
        SLACK_WEBHOOK = credentials('SLACK_WEBHOOK')
        NOTIFY_EMAIL = credentials('NOTIFY_EMAIL')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                script {
                    SHORT_SHA = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    echo "Short SHA: ${SHORT_SHA}"
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    echo "Building Docker image with tag: ${SHORT_SHA}"

                    sh """
                        docker build \
                            -t ${IMAGE_NAME}:latest \
                            -t ${IMAGE_NAME}:${SHORT_SHA} \
                            --build-arg VITE_API_URL=${VITE_API_URL} \
                            --build-arg VITE_CLOUD_NAME=${VITE_CLOUD_NAME} .
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-creds') {
                        docker.image("${IMAGE_NAME}:latest").push()
                        docker.image("${IMAGE_NAME}:${SHORT_SHA}").push()
                    }
                }
            }
        }

        stage('Deploy to Render') {
            steps {
                script {
                    def imageUrl = "docker.io/${IMAGE_NAME}:${SHORT_SHA}"
                    echo "Triggering Render Deployment with image: ${imageUrl}"

                    sh """
                        curl -X GET "${RENDER_DEPLOY_HOOK}&imgURL=${imageUrl}"
                    """
                }
            }
        }
    }

    post {

        success {
            script {
                sh """
                    curl -X POST -H 'Content-type: application/json' \
                    --data '{"text":"✅ SUCCESS: Deployment completed for commit ${SHORT_SHA}"}' \
                    ${SLACK_WEBHOOK}
                """

                emailext(
                    subject: "SUCCESS: Render Deployment (${SHORT_SHA})",
                    body: "Deployment succeeded for commit ${SHORT_SHA}.",
                    to: ${NOTIFY_EMAIL}
                )
            }
        }

        failure {
            script {
                sh """
                    curl -X POST -H 'Content-type: application/json' \
                    --data '{"text":"❌ FAILURE: Deployment failed for commit ${SHORT_SHA}"}' \
                    ${SLACK_WEBHOOK}
                """

                emailext(
                    subject: "FAILURE: Render Deployment (${SHORT_SHA})",
                    body: "Deployment FAILED for commit ${SHORT_SHA}. Check Jenkins logs.",
                    to: ${NOTIFY_EMAIL}
                )
            }
        }

        always {
            sh "docker rmi ${IMAGE_NAME}:latest || true"
            sh "docker rmi ${IMAGE_NAME}:${SHORT_SHA} || true"
        }
    }
}