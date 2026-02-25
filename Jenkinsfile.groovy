pipeline {
    agent { label 'built-in' }

    environment {
        PATH = "/usr/bin:/usr/local/bin:${env.PATH}"
        DOCKER_HUB_USER = credentials('DOCKER_HUB_USER')
        IMAGE_NAME = "${DOCKER_HUB_USER}/trellis"
        VITE_API_URL = credentials('VITE_API_URL')
        VITE_CLOUD_NAME = credentials('VITE_CLOUD_NAME')
        RENDER_DEPLOY_HOOK = credentials('RENDER_DEPLOY_HOOK')
        SLACK_WEBHOOK = credentials('SLACK_WEBHOOK')
        NOTIFY_EMAIL = credentials('NOTIFY_EMAIL')
        SHORT_SHA = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
    }

    stages {
        stage('Checkout & Setup') {
            steps {
                checkout scm
                sh 'git submodule update --init --recursive'
                echo "Starting build for commit: ${SHORT_SHA}"
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB_CREDS', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin
                        docker build \
                            -t ${IMAGE_NAME}:latest \
                            -t ${IMAGE_NAME}:${SHORT_SHA} \
                            --build-arg VITE_API_URL="${VITE_API_URL}" \
                            --build-arg VITE_CLOUD_NAME="${VITE_CLOUD_NAME}" .
                        docker push ${IMAGE_NAME}:latest
                        docker push ${IMAGE_NAME}:${SHORT_SHA}
                        docker logout
                    """
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
                    body: "Deployment succeeded for commit ${SHORT_SHA}. Image: ${IMAGE_NAME}:${SHORT_SHA}",
                    to: env.NOTIFY_EMAIL
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
                    body: "Deployment FAILED for commit ${SHORT_SHA}. Check Jenkins logs at ${env.BUILD_URL}",
                    to: env.NOTIFY_EMAIL
                )
            }
        }

        always {
            // Clean up local images to save Jenkins disk space
            sh "docker rmi ${IMAGE_NAME}:latest || true"
            sh "docker rmi ${IMAGE_NAME}:${SHORT_SHA} || true"
        }
    }
}