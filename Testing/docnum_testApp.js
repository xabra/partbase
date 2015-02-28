// -- DocNum Test App

// --- Set up module with dependencies
var docnumTestApp = angular.module('docnumTestApp', []);



// --- Document list controller ---
docnumTestApp.controller('docnumTestAppCtrl', ['$scope',
	function ($scope) {
		var documentNum = new DocumentNumber();

		//$scope.dn = documentNum.getnum();
		$scope.dnString = documentNum.toString();

		$scope.increment = function() {
			documentNum.incrementBase();
			$scope.dnString = documentNum.toString();
		}
		$scope.reset = function() {
			documentNum.resetBase();
			$scope.dnString = documentNum.toString();
		}
		$scope.bumpRev = function() {
			documentNum.incrementRevision();
			$scope.dnString = documentNum.toString();
		}
		$scope.resetRev = function() {
			documentNum.resetRevision();
			$scope.dnString = documentNum.toString();
		}
	}
]);


