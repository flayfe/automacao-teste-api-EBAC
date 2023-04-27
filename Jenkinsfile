pipeline {
    agent any

    stages {
        stage('Clonar o repositorio') {
            steps {
            git branch: 'master', url: 'https://github.com/flayfe/automacao-teste-api-EBAC.git'
            }
        }
        stage('Instalar dependencias') {
            steps {
            sh 'npm install'
            }
        }
        stage('Subir Serverest e Realizar testes') {
            steps {
            sh 'NO_COLOR=1 npm run cy:run-ci'
            }
        }
    }
}