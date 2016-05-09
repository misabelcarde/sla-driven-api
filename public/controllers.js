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
		refresh(airportsPath(), $scope.airportsList);
	};

	function refreshFlights (){
		refresh(flightsPath(), $scope.flightsList);
	};		

	function airportsPath(properties){
		return pathWithApikey(airportsPathStr, properties);
	};

	function flightsPath(properties){
		return pathWithApikey(flightsPathStr, properties);
	};

	function refresh(path, varToUpdate) {
		$http.get(path).then( function (res){
			console.log("Refresh: Data received successfully " + path);
			varToUpdate = res.data;
		}, function (res){
			$scope.governifyConfigured = false;
			$scope.governifyError = res.data.message + " (" + res.statusText + ")";
			console.log($scope.governifyError);
		});
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
