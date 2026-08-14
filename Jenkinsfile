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

            bat '''
                node generate-report.js
            '''

            script {

                def newStudents = readFile('new-students.json').trim()

                if (newStudents != "[]") {

                    echo "New student registrations detected."

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

                            git diff --cached --quiet || git commit -m "Update student registration feedback report"

                            git push https://%GIT_USERNAME%:%GIT_PASSWORD%@github.com/Vishal34354/Form.git HEAD:main
                        '''
                    }

                } else {

                    echo "No new student registrations. No report update required."

                }
            }
        }

        success {
            echo 'Tests completed successfully.'
        }

        failure {
            echo 'Tests failed.'
        }
    }
}