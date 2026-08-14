pipeline {

    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }
    }

    post {

        always {
            bat 'node generate-report.js'

            withCredentials([
                usernamePassword(
                    credentialsId: 'github-token',
                    usernameVariable: 'GIT_USERNAME',
                    passwordVariable: 'GIT_PASSWORD'
                )
            ]) {

                bat '''
                    git config user.name "Jenkins"
                    git config user.email "jenkins@localhost"

                    git add feedback.md

                    git diff --cached --quiet || git commit -m "Update automated test feedback report"

                    git push https://%GIT_USERNAME%:%GIT_PASSWORD%@github.com/Vishal34354/Form.git HEAD:main
                '''
            }
        }

        success {
            echo 'All tests passed and feedback report pushed to GitHub!'
        }

        failure {
            echo 'Tests failed. Feedback report generated and pushed to GitHub.'
        }
    }
}