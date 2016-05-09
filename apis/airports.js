function AirportsApi(db){
	this.db = db;
	this.rootPath = "/api/airports";
	this.codePath = "/api/airports/:code";
};

AirportsApi.prototype.get = function(req, res){
	console.log("GET " + this.rootPath);
	this.db.find({},function (err, airports){
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

AirportsApi.prototype.post = function(req, res){
	console.log("POST " + this.rootPath);
	this.db.insert(req.body);
	res.sendStatus(200);
};

AirportsApi.prototype.deleteByCode = function(req, res){
	var code = req.params.code;
	console.log("DELETE " + this.codePath + " -> " + code);
	this.db.remove({ code : code},{}, function(err, airport){
		console.log("Airport removed: " + airport);
		if(airport  == 1)
			res.sendStatus(200);
		else
			res.sendStatus(404);
	});
};

module.exports = AirportsApi;