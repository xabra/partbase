

angular.module('navigationModule', [])

// --- NavBar View Controller ---
.controller('navbarCtrl', ['$scope', '$location', 'authenticationService',
   function($scope, $location, authenticationService) {

      $scope.logout = function() {   // If logout command...
         authenticationService.logout();      // The the Authentication service to logout: wipe client-side data caches
         $location.path('/login');     // Redirect to the login view
      }
   }
]);
