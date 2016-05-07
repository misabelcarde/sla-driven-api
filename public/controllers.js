var myApp = angular.module("AirportsApp",[]);

myApp.controller('AirportsAppCtrl', ['$scope', '$http', function($scope, $http){
	var airportsPath = "/airports";
	refresh();

	$scope.addAirport = function(){
		console.log("Inserting airport... ");
		$http.post(airportsPath, $scope.airport).success(function(){
			console.log("POST done");
			refresh();
		});
	};

	$scope.deleteAirport = function(code){
		console.log("Deleting airport with " + code);
		$http.delete(airportsPath + "/" + code);
		refresh();
	};

	function refresh (){
		$http.get(airportsPath).success( function (airports){
			console.log('Refresh: Data received successfully');
			$scope.airportList = airports;
		});
	};	

}]);
