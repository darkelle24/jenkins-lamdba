#!/usr/bin/env groovy

node {
   withEnv(["LT_USERNAME=djilani@deepbloo.com",
    "LT_ACCESS_KEY=ALJIpRO9gXgEgnpwP2iKomHotn5sHG9Yu9WK33Xz0YWxvsZWnJ",
    "LT_TUNNEL=true"]){

    echo env.LT_USERNAME
    echo env.LT_ACCESS_KEY

   stage('setup') {

      // Get some code from a GitHub repository
    try{
      git branch: 'main',
        url: 'https://github.com/darkelle24/jenkins-lamdba.git'


            //Download Tunnel Binary
      sh "wget https://s3.amazonaws.com/lambda-tunnel/LT_Linux.zip"

      //Required if unzip is not installed
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
      // Installing Dependencies
      sh 'sudo npm install pm2 -g'
      sh 'sudo npm install -g serve'
      sh 'sudo npm install -g @lambdatest/node-rest-client'
      sh 'sudo npm install -g nightwatch'
      sh 'npm install'
      sh 'npm run build'
    }

    stage('tunnel') {
      sh "pm2 start ./LT --name=tunnel -- -user ${env.LT_USERNAME} -key ${env.LT_ACCESS_KEY}"
    }

    stage('serve') {
      sh 'pm2 start serve --name=serve -- -s dist --port 8081'
      sh 'sleep 15'
    }

   stage('test') {
          try{
          sh './node_modules/.bin/nightwatch -e chrome tests'
          }
          catch (err){
          echo err
          }
   }
   stage('end') {
     echo "Success"
     }
 }
}
