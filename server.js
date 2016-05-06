//Required modules
var express = require('express'),
	path = require('path'),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	//governify = require("governify"),
	DataStore = require('nedb');

//Required files
var AirportsApi = require("./apis/airports");

//Connection to DB
var dbFileName  = path.join(__dirname,'airports.json');
var db = new DataStore({
	filename : dbFileName,
	autoload: true
});

//Init
var app = express();
//governify.control(app,{ namespace: "mics"});
var airportsApi = new AirportsApi(db);
var port = (process.env.PORT || 10000);

//Middlewares
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());

//Methods airport API
app.get(airportsApi.rootPath, function(req, res){ airportsApi.get(req, res); });
app.get(airportsApi.codePath, function(req, res){ airportsApi.getByCode(req, res); });
app.post(airportsApi.rootPath, function(req, res){ airportsApi.post(req, res); });
app.delete(airportsApi.codePath, function(req, res){ airportsApi.deleteByCode(req, res); });

//Run app
app.listen(port);
console.log('Server running on port ' + port);

