var membershipsControllers = angular.module('membershipsControllers', []);


// --- Memberships list controller ---
membershipsControllers.controller('membershipsListCtrl', ['$scope', 'Memberships',
   function($scope, Memberships) {
      $scope.memberships = Memberships.entries;

      //I DONT UNDERSTAND THIS !! --we need to watch the list of documents more closely to have it always updated ---
      $scope.$watch(function() {
         return Memberships.entries;
      }, function(entries) {
         $scope.memberships = entries;
      });
   }
]);
