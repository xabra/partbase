

angular.module('navigationModule', [])

// --- NavBar View Controller ---
.controller('navbarCtrl', ['$scope', '$location', 'Authentication',
   function($scope, $location, Authentication) {

      $scope.logout = function() {   // If logout command...
         Authentication.logout();      // The the Authentication service to logout: wipe client-side data caches
         $location.path('/login');     // Redirect to the login view
      }
   }
]);
