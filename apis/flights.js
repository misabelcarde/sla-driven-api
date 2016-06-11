function FlightsApi(db){
	this.db = db;
	this.rootPath = "/api/flights";
	this.numberPath = "/api/flights/:number";
	this.maxResources = "MaxFlightResources";
};

FlightsApi.prototype.get = function(req, res){
	console.log("GET " + this.rootPath);
	this.db.find({}, function (err, flights){
		res.json(flights);
	});
};

FlightsApi.prototype.getByNumber = function(req, res){
	var number = req.params.number;
	console.log("GET " + this.numberPath + " -> " + number);
	this.db.find({ number : number},function (err, flight){
		console.log("Flights obtained: " + flight.length);
		if(flight.length > 0){
			res.send(flight[0]);
		}else{
			res.sendStatus(404);
		}
	});
};

FlightsApi.prototype.post = function(req, res, max){
	console.log("POST " + this.rootPath);
	this.db.find({}, function (err, flights){
		if(flights.length < max){
			this.db.insert(req.body);
			res.sendStatus(200);
		}else{
			res.sendStatus(423);
		}
	});
};

FlightsApi.prototype.putByNumber = function(req, res){
	var number = req.params.number;
	console.log("PUT " + this.numberPath + " -> " + number);
	this.db.update({ number : number}, req.body, function(err, flight){
		if(flight  == 1)
			res.sendStatus(200);
		else
			res.sendStatus(404);
	});
};

FlightsApi.prototype.deleteByNumber = function(req, res){
	var number = req.params.number;
	console.log("DELETE " + this.numberPath + " -> " + number);
	this.db.remove({ number : number},{}, function(err, flight){
		console.log("Flight removed: " + flight);
		if(flight  == 1)
			res.sendStatus(200);
		else
			res.sendStatus(404);
	});
};

module.exports = FlightsApi;