var accountsControllers = angular.module('accountsControllers', []);


// --- Accounts list controller ---
accountsControllers.controller('usersListCtrl', ['$scope', 'Users',
   function($scope, Users) {
      $scope.users = Users.entries;

      //I DONT UNDERSTAND THIS !! --we need to watch the list of documents more closely to have it always updated ---
      $scope.$watch(function() {
         return Users.entries;
      }, function(entries) {
         $scope.users = entries;
      });
   }
]);
