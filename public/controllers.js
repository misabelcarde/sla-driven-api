var myApp = angular.module("AirportsApp",[]);

myApp.controller('AirportsAppCtrl', ['$scope', '$http', function($scope, $http){
	$scope.showGovernifyConfig = false;
	$scope.governifyConfigured = false;
	$scope.governifyErrorAirport = null;
	$scope.governifyErrorFlight = null;

	var airportsPathStr = "/api/airports";
	var flightsPathStr = "/api/flights";
	var apikeyParam = "?apikey=";
	retrieveLocalGovernifyKey();
	refreshAirports();
	refreshFlights();

	$scope.addAirport = function(){
		console.log("Inserting airport... " + airportsPath());
		$http.post(airportsPath(), $scope.airport).then(function(){
			console.log("POST done");
			$scope.airport = null;
			refreshAirports();
		},function(res){
			console.log("add airport error");
			refreshAirports();
		});
	};

	$scope.deleteAirport = function(code){
		console.log("Deleting airport with " + code + " " + airportsPath("/" + code));
		$http.delete(airportsPath("/" + code)).then(refreshAirports(), refreshAirports());
	};

	$scope.selectAirport = function(airport){
		$scope.selectedAirport = angular.copy(airport);
	};

	$scope.editAirport = function(airport){
		console.log("Editing airport... " + airport.code + " " + airportsPath("/" + airport.code));
		$http.put(airportsPath("/" + airport.code), airport).then(function(){
			console.log("PUT done");
			$scope.selectedAirport = null;
			refreshAirports();
		}, function(res){
			console.log("editAirport error");
			refreshAirports();
		});
	}

	$scope.addFlight = function(){
		console.log("Inserting flight... " + flightsPath());
		$http.post(flightsPath(), $scope.flight).then(function(){
			console.log("POST done");
			$scope.flight = null;
			refreshFlights();
		}, function(res){
			console.log("addFlight error");
			refreshFlights();
		});
	};

	$scope.deleteFlight = function(number){
		console.log("Deleting flight with " + number + " " + flightsPath("/" + number));
		$http.delete(flightsPath("/" + number)).then(refreshFlights(), refreshFlights());
	};

	$scope.selectFlight = function(flight){
		$scope.selectedFlight = angular.copy(flight);
	};

	$scope.editFlight = function(flight){
		console.log("Editing flight... " + flight.number + " " + flightsPath("/" + flight.number));
		$http.put(flightsPath("/" + flight.number), flight).then(function(){
			console.log("PUT done");
			$scope.selectedFlight = null;
			refreshFlights();
		}, function(res){
			console.log("editFlight error");
			refreshFlights();
		});
	}

	$scope.configGovernify = function(){
		$scope.governifyConfigured = true; 
		$scope.showGovernifyConfig = !$scope.showGovernifyConfig;
		$scope.governifyErrorAirport = null;
		$scope.governifyErrorFlight = null;
		if (typeof(Storage) !== "undefined") {
		    localStorage.setItem("governifyKey", $scope.governifyApikey);
		}
		refreshAirports();
		refreshFlights();
		console.log("Governify configured!");
	};

	function retrieveLocalGovernifyKey(){
		if (typeof(Storage) !== "undefined") {
			$scope.governifyApikey = localStorage.getItem("governifyKey");
			$scope.governifyConfigured = true;
		}
	};

	function refreshAirports (){
		$http.get(airportsPath()).then( function (res){
			console.log("Refresh: Data received successfully " + airportsPath());
			$scope.airportsList = res.data;
		}, function (res){
			//$scope.governifyConfigured = false;
			console.log("refreshAirports error");
			$scope.governifyErrorAirport = res.data.message + " (" + res.statusText + ")";
			console.log($scope.governifyErrorAirport);
		});
	};

	function refreshFlights (){
		$http.get(flightsPath()).then( function (res){
			console.log("Refresh: Data received successfully " + flightsPath());
			$scope.flightsList = res.data;
		}, function (res){
			//$scope.governifyConfigured = false;
			console.log("refreshFlights error");
			$scope.governifyErrorFlight = res.data.message + " (" + res.statusText + ")";
			console.log($scope.governifyErrorFlight);
		});
	};		

	function airportsPath(properties){
		return pathWithApikey(airportsPathStr, properties);
	};

	function flightsPath(properties){
		return pathWithApikey(flightsPathStr, properties);
	};

	function pathWithApikey(mainPath, properties){
		var resourceProperties = "";
		if(!(typeof properties === "undefined")){
			resourceProperties = properties;
		}
		if(typeof $scope.governifyApikey === "undefined"){
			return mainPath + resourceProperties;
		}else{
			return mainPath + resourceProperties + apikeyParam + $scope.governifyApikey;	
		}
	};

}]);
