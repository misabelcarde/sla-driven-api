var myApp = angular.module("AirportsApp",[]);

myApp.controller('AirportsAppCtrl', ['$scope', '$http', function($scope, $http){
	$scope.showGovernifyConfig = false;
	$scope.governifyConfigured = false;
	$scope.governifyError = null;

	var airportsPathStr = "/api/airports";
	var flightsPathStr = "/api/flights";
	var apikeyParam = "?apikey=";
	retrieveLocalGovernifyKey();
	refreshAirports();
	refreshFlights();

	$scope.addAirport = function(){
		console.log("Inserting airport... " + airportsPath());
		$http.post(airportsPath(), $scope.airport).success(function(){
			console.log("POST done");
			$scope.airport = null;
			refreshAirports();
		});
	};

	$scope.deleteAirport = function(code){
		console.log("Deleting airport with " + code + " " + airportsPath("/" + code));
		$http.delete(airportsPath("/" + code));
		refreshAirports();
	};

	$scope.selectAirport = function(airport){
		$scope.selectedAirport = angular.copy(airport);
	};

	$scope.editAirport = function(airport){
		console.log("Editing airport... " + airport.code + " " + airportsPath("/" + airport.code));
		$http.put(airportsPath("/" + airport.code), airport).success(function(){
			console.log("PUT done");
			$scope.selectedAirport = null;
			refreshAirports();
		});
	}

	$scope.addFlight = function(){
		console.log("Inserting flight... " + flightsPath());
		$http.post(flightsPath(), $scope.flight).success(function(){
			console.log("POST done");
			$scope.flight = null;
			refreshFlights();
		});
	};

	$scope.deleteFlight = function(number){
		console.log("Deleting flight with " + number + " " + flightsPath("/" + number));
		$http.delete(flightsPath("/" + number));
		refreshFlights();
	};

	$scope.selectFlight = function(flight){
		$scope.selectedFlight = angular.copy(flight);
	};

	$scope.editFlight = function(flight){
		console.log("Editing flight... " + flight.number + " " + flightsPath("/" + flight.number));
		$http.put(flightsPath("/" + flight.number), flight).success(function(){
			console.log("PUT done");
			$scope.selectedFlight = null;
			refreshFlights();
		});
	}

	$scope.configGovernify = function(){
		$scope.governifyConfigured = true; 
		$scope.showGovernifyConfig = !$scope.showGovernifyConfig;
		$scope.governifyError = null;
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
			$scope.governifyConfigured = false;
			$scope.governifyError = res.data.message + " (" + res.statusText + ")";
			console.log($scope.governifyError);
		});
	};

	function refreshFlights (){
		$http.get(flightsPath()).then( function (res){
			console.log("Refresh: Data received successfully " + flightsPath());
			$scope.flightsList = res.data;
		}, function (res){
			$scope.governifyConfigured = false;
			$scope.governifyError = res.data.message + " (" + res.statusText + ")";
			console.log($scope.governifyError);
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
