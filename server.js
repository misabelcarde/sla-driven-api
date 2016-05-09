//Required modules
var express = require('express'),
	path = require('path'),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	governify = require("governify"),
	DataStore = require('nedb');

//Required files
var AirportsApi = require("./apis/airports");
var FlightsApi = require("./apis/flights");

//Connection to DB
var dbFileNameAirports  = path.join(__dirname,'airports.json');
var dbAirports = new DataStore({
	filename : dbFileNameAirports,
	autoload: true
});
var dbFileNameFlights  = path.join(__dirname,'flights.json');
var dbFlights = new DataStore({
	filename : dbFileNameFlights,
	autoload: true
});

//Init
var app = express();
governify.control(app,{ namespace: "awsg3", defaultPath: "/api"});
var airportsApi = new AirportsApi(dbAirports);
var flightsApi = new FlightsApi(dbFlights);
var port = (process.env.PORT || 10000);

//Middlewares
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());

//Methods airports API
app.get(airportsApi.rootPath, function(req, res){ airportsApi.get(req, res); });
app.get(airportsApi.codePath, function(req, res){ airportsApi.getByCode(req, res); });
app.post(airportsApi.rootPath, function(req, res){ airportsApi.post(req, res); });
app.delete(airportsApi.codePath, function(req, res){ airportsApi.deleteByCode(req, res); });

//Methods flights API
app.get(flightsApi.rootPath, function(req, res){ flightsApi.get(req, res); });
app.get(flightsApi.numberPath, function(req, res){ flightsApi.getByNumber(req, res); });
app.post(flightsApi.rootPath, function(req, res){ flightsApi.post(req, res); });
app.delete(flightsApi.numberPath, function(req, res){ flightsApi.deleteByNumber(req, res); });

//Run app
app.listen(port);
console.log('Server running on port ' + port);

