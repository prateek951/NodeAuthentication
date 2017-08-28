myApp.controller('page1Controller', ['$scope', function($scope){
	$scope.user = {
		firstname: "lorem",
		lastname: "ipsum",
		run: function(destination){
			return this.firstname + " is running to " + destination;
		}
	}
}]);