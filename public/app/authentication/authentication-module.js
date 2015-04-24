angular.module('authenticationModule', [])


// --- Login View Controller ---
.controller('loginCtrl', ['$location', 'authenticationService',
   function($location, authenticationService) {
      var self = this; // Capture scope
      var Service = authenticationService;

      // Initialization
      self.account = { email: '', password: ''};

      //TODO give feedback on failed login

      self.login = function() {      // When the login button is clicked...
         var authRequest = {     // Create an auth request from the form fields supplied by account
            accountname: self.account.email,     // Stormpath expects an authRequest object with a 'accountname' key
            password: self.account.password
         };
         console.log("CLIENT: Attempting to authenticate with: " + JSON.stringify(authRequest));
         Service.authenticate(authRequest);
         // TODO: Handle errors and redirects here
      };

   }
])

// --- Register View Controller ---
.controller('registerCtrl', ['$location', 'authenticationService',
   function($location, authenticationService) {
      var self = this; // Capture scope
      var Service = authenticationService;

      self.account = {
         givenName: '',
         surname: '',
         email: '',
         password: '',
      };

      self.message = '';

      //--
      self.register = function() {     // When the register button is clicked...
         var newAccount = {      // Create a new account object
            givenName: self.account.givenName,
            surname: self.account.surname,
            accountName: '',
            email: self.account.email,
            password: self.account.password,
         };
         console.log("C controller: Registering: " + JSON.stringify(newAccount));
         Service.register(newAccount);      // Invoke register on the Authentication service with the new account
         // TODO: Handle errors and redirects here
      };
   }
])



/*
 *=====  AUTHENTICATION Service: provides access to the tenants  =====
 */
.factory('authenticationService', function($http, $location) {

   // --- Initialization, executed during a page refresh
   var service = {}; // Reset the service object
   console.log('<< Authentication SERVICE initialized');


   service.logout = function() {
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
            $location.path('/dashboard') //Redirect to documents/dashboard page
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
            $location.path('/dashboard') //Redirect to documents page
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
