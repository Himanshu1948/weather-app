const express = require('express');
const https = require('https');
const {contentDisposition} = require("express/lib/utils");

const app = express();

app.listen(3000,function (){
    console.log("Server up on the port 3000")
});

app.use(express.static('public'));

app.get("/", function (request, respone){
   respone.sendFile(__dirname + '/index.html');
   const key = 'beb103c0a5d04246179c80ce5ce2fb9c';
   const lat = 10.99;
   const lon = 44.34;
   //20fdfb76008f0d97399a7057b61972e9
   const url = 'https://api.openweathermap.org/data/2.5/weather?lat=10.99&lon=44.34&appid=';
   https.get(url, function (respone){
       console.log(respone.statusCode);

       respone.on("data", function (data){
           const weatherData = JSON.parse(data);
           console.log(weatherData);
       })
   });
});

/*
https://home.openweathermap.org/api_keys
https://openweathermap.org/current
*/