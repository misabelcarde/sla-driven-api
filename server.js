//Required modules http://datastore.governify.io/api/v6.1/awsg3/agreements
var express = require('express'),
	request = require('sync-request'),
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
var airportsApi = new AirportsApi(dbAirports);
var flightsApi = new FlightsApi(dbFlights);
var port = (process.env.PORT || 10000);
var governifyNamespace = "awsg3";
var propertiesPathExt = "http://datastore.governify.io/api/v6.1/" + governifyNamespace + "/agreements/{idAgreement}/properties/{resource}";
var propertiesPath = "/slaProperties/:idAgreement/:resource";
governify.control(app,{ 
	namespace: governifyNamespace, 
	defaultPath: "/api",
	customMetrics:[
		{
			path: "/api/flights",
			term: "FlightRequestTerm",
			metric: "FlightRequests",
			calculate: function(actualValue, req, res, callback){
				callback(parseInt(actualValue) + 1);
			}
		},
		{
			path: "/api/airports",
			term: "AirportRequestTerm",
			metric: "AirportRequests",
			calculate: function(actualValue, req, res, callback){
				callback(parseInt(actualValue) + 1);
			}
		}, 
		{
			path: "/api/flights",
			term: "FlightResourceTerm",
			metric: "FlightResources",
			calculate: function(actualValue, req, res, callback){
				dbFlights.find({},function (err, flights){
					callback(flights.length);
				});
			}
		},
		{
			path: "/api/airports",
			term: "AirportResourceTerm",
			metric: "AirportResources",
			calculate: function(actualValue, req, res, callback){
				dbAirports.find({},function (err, airports){
					callback(airports.length);
				});
			}
		},
		{
			metric: "AVGResponseTime",
			calculate: function(actualValue, req, res, callback){
				callback( res._headers['x-response-time'] );
			}
		}
	]
});

//Middlewares
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());

//Methods airports API
app.get(airportsApi.rootPath, function(req, res){ airportsApi.get(req, res); });
app.get(airportsApi.codePath, function(req, res){ airportsApi.getByCode(req, res); });
app.post(airportsApi.rootPath, function(req, res){ airportsApi.post(req, res, maxResources(req.query.apikey, airportsApi.maxResources)); });
app.put(airportsApi.codePath, function(req, res){ airportsApi.putByCode(req, res); });
app.delete(airportsApi.codePath, function(req, res){ airportsApi.deleteByCode(req, res); });

//Methods flights API
app.get(flightsApi.rootPath, function(req, res){ flightsApi.get(req, res); });
app.get(flightsApi.numberPath, function(req, res){ flightsApi.getByNumber(req, res); });
app.post(flightsApi.rootPath, function(req, res){ flightsApi.post(req, res, maxResources(req.query.apikey, flightsApi.maxResources)); });
app.put(flightsApi.numberPath, function(req, res){ flightsApi.putByNumber(req, res); });
app.delete(flightsApi.numberPath, function(req, res){ flightsApi.deleteByNumber(req, res); });

//Max resources properties
app.get(propertiesPath, function(req, res){
	var maxNumber = maxResources(req.params.idAgreement, req.params.resource);
	res.send(String(maxNumber));
});

var maxResources = function(idAgreement, resourceType){
	var response = request("GET", propertiesPathExt.replace("{idAgreement}", idAgreement).replace("{resource}", resourceType));
	if(response.statusCode == 200){
		return JSON.parse(response.getBody('utf8')).value;
	}else{
		return 0;
	}
};

//Run app
app.listen(port);
console.log('Server running on port ' + port);

