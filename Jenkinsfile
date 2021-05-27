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
      sh 'sudo apt-get install --no-act unzip'
      sh 'unzip -o LT_Linux.zip'

      //Starting Tunnel Process
      sh "./LT -user ${env.LT_USERNAME} -key ${env.LT_ACCESS_KEY} &"
      sh  "rm -rf LT_Linux.zip"
    }
    catch (err){
      echo err
   }

   }
   stage('build') {
      // Installing Dependencies
      sh 'npm install pm2 -g'
      sh 'npm install'
      sh 'pm2 start npm --name=test -- run serve'
    }

   stage('test') {
          try{
          sh './node_modules/.bin/nightwatch -e chrome,edge tests'
          }
          catch (err){
          echo err
          }
   }
   stage('finish') {
     sh 'pm2 stop test'
   }
   stage('end') {
     echo "Success"
     }
 }
}
