const express = require('express');
const https = require('https');
const {contentDisposition} = require("express/lib/utils");
const path = require("path");
const bodyParser = require('body-parser');
const {static} = require("express");
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

app.listen(3000,function (){
    console.log("Server up on the port 3000")
});

app.use(express.static('public'))

app.get("/", function (req, res){
    const key = 'beb103c0a5d04246179c80ce5ce2fb9c';
    const city = 'London';
    const geoCodingURL = 'https://api.openweathermap.org/geo/1.0/direct?q='+city+'&appid='+key;
    https.get(geoCodingURL, function (geoResponse){
        // we get the city here.
        geoResponse.on("data", function (geoData){
            const data = JSON.parse(geoData);
            const lat = data[0].lat;
            const lon = data[0].lon;

            // now we make the API call for the weather data.
            const weatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + lon +'&appid=' + key;
            https.get(weatherURL, function (weatherResponse){
                weatherResponse.on("data", function (weathData) {
                    const weatherData = JSON.parse(weathData);
                    const temp = Math.round(weatherData.main.temp - 273);
                    const month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const days_name = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                    const today = new Date();
                    const [hours, minutes, day, month, date, year] = [
                        today.getHours(),
                        today.getMinutes() <= 9 ? '0' + today.getMinutes() : today.getMinutes(),
                        days_name[today.getDay()],
                        month_names_short[today.getMonth()], // months are 0-indexed
                        today.getDate(),
                        today.getFullYear() % 100,
                    ];
                    const options =
                        {
                            ejs_temp : temp,
                            ejs_hours : hours,
                            ejs_minutes : minutes,
                            ejs_day : day,
                            ejs_date : date,
                            ejs_month : month,
                            ejs_year : year
                        }
                    res.render("list", options);
                });
            });
        });
    });
});
/*
https://home.openweathermap.org/api_keys
https://openweathermap.org/current
API URL : https://api.openweathermap.org/data/2.5/weather?lat=10.99&lon=44.34&appid=beb103c0a5d04246179c80ce5ce2fb9c
*/