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
        }

        success {
            echo 'All tests passed!'
        }

        failure {
            echo 'Tests failed!'
        }
    }
}