var myApp = angular.module("AirportsApp",[]);

myApp.controller('AirportsAppCtrl', ['$scope', '$http', function($scope, $http){
	console.log("Controller initialized");

	var refresh = function (){
		$http.get('/airports').success( function (airports){
			console.log('Data received successfully');
			$scope.airportList = airports;
		});
	}

	refresh();

	$scope.addAirport = function(){
		console.log("Inserting airport... ");
		$http.post('/airports', $scope.airport).success(function(){
			console.log("POST done");
			refresh();
		});
	}

	$scope.deleteAirport = function(code){
		console.log("Deleting airport with " + code);
		$http.delete('/airport/' + code);
		refresh();
	}

	

}]);
