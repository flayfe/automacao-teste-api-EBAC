pipeline {
    agent any

    stages {
        stage('Clonar o repositorio') {
            steps {
            git branch: 'main', url: 'https://github.com/flayfe/automacao-teste-api-EBAC.git'
            }
        }
        stage('Instalar dependencias') {
            steps {
            sh 'npm install'
            }
        }
        stage('Subir Serverest localmente') {
            steps {
            sh 'npx serverest'
            }
        }
        stage('Executar testes') {
            steps {
            sh 'NO_COLOR=1 npx cypress open'
            }
        }
    }
}