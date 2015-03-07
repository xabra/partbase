/* Controllers */

var partBaseControllers = angular.module('partBaseControllers', []);

// --- NavBar View Controller ---
partBaseControllers.controller('navbarCtrl', ['$scope', '$location', 'Authentication',
   function($scope, $location, Authentication) {

      $scope.logout = function() {   // If logout command...
         Authentication.logout();      // The the Authentication service to logout: wipe client-side data caches
         $location.path('/login');     // Redirect to the login view
      }
   }
]);

// --- Login View Controller ---
partBaseControllers.controller('loginCtrl', ['$scope', '$location', '$http', 'Authentication',
   function($scope, $location, $http, Authentication) {
      // Initialization
      $scope.user = { email: '', password: ''};

      //TODO give feedback on failed login

      $scope.login = function() {      // When the login button is clicked...
         var authRequest = {     // Create an auth request from the form fields supplied by user
            username: $scope.user.email,     // Stormpath expects an authRequest object with a 'username' key
            password: $scope.user.password
         };
         console.log("CLIENT: Attempting to authenticate with: " + JSON.stringify(authRequest));
         Authentication.authenticate(authRequest);
         // TODO: Handle errors and redirects here
      };

   }
]);

// --- Register View Controller ---
partBaseControllers.controller('registerCtrl', ['$scope', '$location', '$http','Authentication',
   function($scope, $location, $http, Authentication) {

      $scope.user = {
         givenName: '',
         surname: '',
         tenant: '',
         email: '',
         password: '',
      };

      $scope.message = '';

      //--
      $scope.register = function() {     // When the register button is clicked...
         var newAccount = {      // Create a new account object
            givenName: $scope.user.givenName,
            surname: $scope.user.surname,
            username: '',
            email: $scope.user.email,
            password: $scope.user.password,
            customData: {
               tenant: $scope.user.tenant
            }
         };
         console.log("Registering: " + JSON.stringify(newAccount));
         Authentication.register(newAccount);      // Invoke register on the Authentication service with the new account
         // TODO: Handle errors and redirects here
      };
   }
]);
