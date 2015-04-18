

angular.module('navigationModule', [])

// --- NavBar View Controller ---
.controller('navbarCtrl', ['$scope', '$location',
   function($scope, $location) {

      $scope.logout = function() {   // If logout command...
         $location.path('/api/login');     // Redirect to the login view
      }
   }
]);
