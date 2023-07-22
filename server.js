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

app.post("/", function (req, res){
    const key = 'beb103c0a5d04246179c80ce5ce2fb9c';
    const city = req.body.cityIn;

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
                    const description = weatherData.weather[0].description;
                    const humidity = weatherData.main.humidity;
                    const wind = weatherData.wind.speed;
                    const visibility = weatherData.visibility;
                    const cloudiness = weatherData.clouds.all;
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
                            city : city,
                            temp : temp,
                            hours : hours,
                            minutes : minutes,
                            day : day,
                            date : date,
                            month : month,
                            year : year,
                            humidity : humidity,
                            wind : wind,
                            description : description,
                            cloudiness : cloudiness,
                            visibility : visibility
                        }
                    res.render("list", options);
                });
            });
        });
    });
});

app.get("/", function (req, res){
    const key = 'beb103c0a5d04246179c80ce5ce2fb9c';
    const city = 'london';
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
                            city : "London",
                            temp : temp,
                            hours : hours,
                            minutes : minutes,
                            day : day,
                            date : date,
                            month : month,
                            year : year,
                            humidity : 0,
                            wind : 0,
                            description : "N/A",
                            cloudiness : "N/A",
                            visibility : "N/A"
                        }
                    res.render("list", options);
                });
            });
        });
    });
});
