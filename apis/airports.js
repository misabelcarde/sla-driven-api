function AirportsApi(db){
	this.db = db;
	this.rootPath = "/api/airports";
	this.codePath = "/api/airports/:code";
	this.maxResources = "MaxAirportResources";
};

AirportsApi.prototype.get = function(req, res){
	console.log("GET " + this.rootPath);
	this.db.find({}, function (err, airports){
		res.json(airports);
	});
};

AirportsApi.prototype.getByCode = function(req, res){
	var code = req.params.code;
	console.log("GET " + this.codePath + " -> " + code);
	this.db.find({ code : code},function (err, airport){
		console.log("Airports obtained: " + airport.length);
		if(airport.length > 0){
			res.send(airport[0]);
		}else{
			res.sendStatus(404);
		}
	});
};

AirportsApi.prototype.post = function(req, res, max){
	console.log("POST " + this.rootPath);
	var currentDb = this.db;
	this.db.find({}, function (err, airports){
		if(airports.length < max){
			currentDb.insert(req.body);
			res.sendStatus(200);
		}else{
			res.sendStatus(423);
		}
	});
	
};

AirportsApi.prototype.putByCode = function(req, res){
	var code = req.params.code;
	console.log("PUT " + this.codePath + " -> " + code);
	this.db.update({ code : code}, req.body, function(err, airport){
		if(airport  == 1)
			res.sendStatus(200);
		else
			res.sendStatus(404);
	});
};

AirportsApi.prototype.deleteByCode = function(req, res){
	var code = req.params.code;
	console.log("DELETE " + this.codePath + " -> " + code);
	this.db.remove({ code : code},{}, function(err, airport){
		if(airport  == 1)
			res.sendStatus(200);
		else
			res.sendStatus(404);
	});
};

module.exports = AirportsApi;