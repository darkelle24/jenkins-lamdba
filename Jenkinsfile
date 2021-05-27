#!/usr/bin/env groovy

node {
   withEnv(["LT_USERNAME=djilani@deepbloo.com",
    "LT_ACCESS_KEY=ALJIpRO9gXgEgnpwP2iKomHotn5sHG9Yu9WK33Xz0YWxvsZWnJ",
    "LT_TUNNEL=true"]){

    echo env.LT_USERNAME
    echo env.LT_ACCESS_KEY

   stage('setup') {

    try{
      git branch: 'main',
        url: 'https://github.com/darkelle24/jenkins-lamdba.git'

      sh "wget https://s3.amazonaws.com/lambda-tunnel/LT_Linux.zip"

      sh 'sudo apt-get -y install nodejs npm'
      sh 'sudo apt-get install --no-act unzip'
      sh 'unzip -o LT_Linux.zip'

      sh  "rm -rf LT_Linux.zip"
    }
    catch (err){
      echo err
   }

   }
   stage('build') {
      sh 'sudo npm install pm2 -g'
      sh 'sudo npm install -g serve'
      sh 'sudo npm install @lambdatest/node-rest-client'
      sh 'sudo npm install nightwatch'
      sh 'npm install'
      sh 'npm run build'
    }

    stage('tunnel') {
      sh 'pm2 flush all'
      sh 'pm2 start ./LT --name=tunnel -- -user djilani@deepbloo.com -key ALJIpRO9gXgEgnpwP2iKomHotn5sHG9Yu9WK33Xz0YWxvsZWnJ'
    }

    stage('serve') {
      sh 'pm2 start serve --name=serve -- dist -l 4000'
    }

    stage('wait') {
      sh 'sleep 30'
      sh 'pm2 logs tunnel --format --lines 50'
    }

   stage('test') {
      try {
        sh './node_modules/.bin/nightwatch -e chrome tests'
      } catch (err) {
        echo err
      }
   }
   stage('end') {
     sh 'pm2 stop tunnel'
     sh 'pm2 stop serve'
     sh 'pm2 flush'
     echo "Success"
     }
 }
}
