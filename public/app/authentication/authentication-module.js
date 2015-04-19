angular.module('authenticationModule', [])


// --- Login View Controller ---
.controller('loginCtrl', ['$scope', '$location', '$http', 'authenticationService',
   function($scope, $location, $http, authenticationService) {
      // Initialization
      $scope.account = { email: '', password: ''};

      //TODO give feedback on failed login

      $scope.login = function() {      // When the login button is clicked...
         var authRequest = {     // Create an auth request from the form fields supplied by account
            accountname: $scope.account.email,     // Stormpath expects an authRequest object with a 'accountname' key
            password: $scope.account.password
         };
         console.log("CLIENT: Attempting to authenticate with: " + JSON.stringify(authRequest));
         authenticationService.authenticate(authRequest);
         // TODO: Handle errors and redirects here
      };

   }
])

// --- Register View Controller ---
.controller('registerCtrl', ['$scope', '$location', '$http','authenticationService',
   function($scope, $location, $http, authenticationService) {

      $scope.account = {
         givenName: '',
         surname: '',
         email: '',
         password: '',
      };

      $scope.message = '';

      //--
      $scope.register = function() {     // When the register button is clicked...
         var newAccount = {      // Create a new account object
            givenName: $scope.account.givenName,
            surname: $scope.account.surname,
            accountName: '',
            email: $scope.account.email,
            password: $scope.account.password,
         };
         console.log("C controller: Registering: " + JSON.stringify(newAccount));
         authenticationService.register(newAccount);      // Invoke register on the Authentication service with the new account
         // TODO: Handle errors and redirects here
      };
   }
])



/*
 *=====  AUTHENTICATION Service: provides access to the tenants  =====
 */
.factory('authenticationService', function($http, $location, tenantsService, documentsService, accountsService) {

   // --- Initialization, executed during a page refresh
   var service = {}; // Reset the service object
   console.log('<< Authentication SERVICE initialized');

   service.flushAll = function() {
      tenantsService.flush();
      documentsService.flush();
      accountsService.flush();
   }

   service.logout = function() {
      service.flushAll();
      $http.post('/accounts/logout'). // Tell server to logout account
      success(function(response) {
         console.log("SUCCESSFUL. Server Logged out");
      }).
      error(function(data, status) {
         //
      });
   }

   service.authenticate = function(authRequest) {
      $http.post('/api/accounts/authenticate', authRequest)
         .success(function(data, status, headers, config) {
            console.log("CLIENT: AUTHENTICATED ACCOUNT: " + JSON.stringify(data) + "HEADERS:" + JSON.stringify(headers));
            // TODO: Need to decide wether to cache the account on the client side here
            $location.path('/documents') //Redirect to documents/dashboard page
            // TODO : Refactor the redirects and UI stuff out of here
         })
         .error(function(data, status, headers, config) {
            // TODO: Erase the token/cookie and client side account info if the account fails to log in

            // Handle login errors here
            console.log("CLIENT: received err");
            // TODO: GIVE FAIL FEEDBACK HERE:  $scope.message = 'Error: Invalid account or password';
            // TODO : Refactor the redirects and UI stuff out of here
         });
   }

   service.register = function(newAccount) {
      console.log("C register service: Registering: " + JSON.stringify(newAccount));
      $http.post('/api/accounts/register', newAccount)
         .success(function(data, status, headers, config) {
            console.log("Registration SUCCESSFUL - Account created: " + JSON.stringify(data));
            // TODO: Need to decide wether to cache the account on the client side here
            $location.path('/accounts') //Redirect to documents page
            // TODO : Refactor the redirects and UI stuff out of here
         })
         .error(function(data, status) {
            // TODO: Erase the token/cookie and client side account info if the account fails to log in
            // TODO: GIVE FAIL FEEDBACK HERE:  $scope.message = 'Error: Invalid account or password';
            alert('Registration error');
            // TODO : Refactor the redirects and UI stuff out of here
         });
   }

   return service;
});
