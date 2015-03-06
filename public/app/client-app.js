// ===== client-app.js =====
// CLIENT-SIDE app module does app setup, routing and document service

// --- Set up module with dependencies
var partBaseApp = angular.module('partBaseApp', [
   'ngRoute',
   'partBaseControllers',
   'constants'
]);

// --- Route Config ---
partBaseApp.config(['$routeProvider', '$locationProvider',
   function($routeProvider, $locationProvider) {
      $routeProvider.
      when('/', {
         redirectTo: '/docs'
      }).
      when('/docs', {
         templateUrl: 'app/doc-list.tmpl.html',
         controller: 'docListCtrl'
      }).
      when('/docs/new', {
         templateUrl: 'app/doc-new.tmpl.html',
         controller: 'docEditCtrl'
      }).
      when('/docs/edit/:id', {
         templateUrl: 'app/doc-new.tmpl.html',
         controller: 'docEditCtrl'
      }).
      when('/docs/detail/:id', {
         templateUrl: 'app/doc-detail.tmpl.html',
         controller: 'docDetailCtrl'
      }).
      when('/login', {
         templateUrl: 'app/login.tmpl.html',
         controller: 'loginCtrl'
      }).
      when('/register', {
         templateUrl: 'app/register.tmpl.html',
         controller: 'registerCtrl'
      }).
      when('/users/list', {
         templateUrl: 'app/users-list.tmpl.html',
         controller: 'usersListCtrl'
      }).
      when('/tenants/list', {
         templateUrl: 'app/tenants-list.tmpl.html',
         controller: 'tenantsListCtrl'
      }).
      when('/tenants/create', {
         templateUrl: 'app/tenants-create.tmpl.html',
         controller: 'tenantsCreateCtrl'
      }).
      when('/groups', {
         templateUrl: 'app/groups-list.tmpl.html',
         controller: 'groupsListCtrl'
      }).
      when('/memberships', {
         templateUrl: 'app/memberships-list.tmpl.html',
         controller: 'membershipsListCtrl'
      }).
      otherwise({
         redirectTo: '/docs'
      });
   }
]);


/*
 *=====  AUTHENTICATION Service: provides access to the tenants  =====
 */
partBaseApp.factory('Authentication', function($http, $location, Tenants, Documents, Users) {

   // --- Initialization, executed during a page refresh
   var service = {}; // Reset the service object
   console.log('<< Authentication SERVICE initialized');

   service.flushAll = function() {
      Tenants.flush();
      Documents.flush();
      Users.flush();
   }

   service.logout = function() {
      service.flushAll();
      $http.post('/logout'). // Tell server to logout user
      success(function(response) {
         console.log("SUCCESSFUL. Server Logged out");
      }).
      error(function(data, status) {
         //
      });
   }

   service.authenticate = function(authRequest) {
      $http.post('/authenticate', authRequest)
         .success(function(data, status, headers, config) {
            console.log("CLIENT: AUTHENTICATED ACCOUNT: " + JSON.stringify(data) + "HEADERS:" + JSON.stringify(headers));
            // TODO: Need to decide wether to cache the account on the client side here
            $location.path('/docs') //Redirect to docs/dashboard page
            // TODO : Refactor the redirects and UI stuff out of here
         })
         .error(function(data, status, headers, config) {
            // TODO: Erase the token/cookie and client side account info if the user fails to log in

            // Handle login errors here
            console.log("CLIENT: received err");
            // TODO: GIVE FAIL FEEDBACK HERE:  $scope.message = 'Error: Invalid user or password';
            // TODO : Refactor the redirects and UI stuff out of here
         });
   }

   service.register = function(newAccount) {
      $http.post('/register', newAccount)
         .success(function(data, status, headers, config) {
            console.log("Registration SUCCESSFUL - Account created: " + JSON.stringify(data));
            // TODO: Need to decide wether to cache the account on the client side here
            $location.path('/docs') //Redirect to docs page
            // TODO : Refactor the redirects and UI stuff out of here
         })
         .error(function(data, status) {
            // TODO: Erase the token/cookie and client side account info if the user fails to log in
            // TODO: GIVE FAIL FEEDBACK HERE:  $scope.message = 'Error: Invalid user or password';
            alert('Registration error');
            // TODO : Refactor the redirects and UI stuff out of here
         });
   }

   return service;
});

/*
 *=====  Groups Service: provides access to the groups  =====
 */
partBaseApp.factory('Groups', function($http) {

   // --- Initialization, executed during a page refresh
   var service = {}; // Reset the service object
   service.entries = []; // Reset the the array of documents

   console.log('<< Groups SERVICE initialized');


   // ---- METHODS ----
   service.create = function(entry) {
      console.log('<< CLIENT REGISTER NEW Group: >>' + JSON.stringify(entry));
      $http.post('/api/groups', entry).
      success(function(response) {
         console.log("SUCCESSFUL. Server Response: " + JSON.stringify(response));
      }).
      error(function(data, status) {
         alert('New entry error!');
      });
   }

   service.flush = function() {
      console.log('<< FLUSH group');
      service.entries = []; // Clear out cache
   }

   //----- Read in all documents via http GET
   service.list = function() {
      //----- HTTP Get data
      $http.get('/api/groups').
      success(function(response) { // If GET is successful...
         service.entries = response;
         service.entries.forEach(function(element) { // loop over all documents
            element.createdDate = new Date(element.createdDate); //convert date strings to Date objects
         });
      }).
      error(function(response, status) { // Otherwise, error during GET
         console.log('<< Groups: ERR: During CLIENT GETting groups');
      });
   }

   service.list(); // Call the server and read in all the documents

   //----- delete an entry
   service.delete = function(entry) {
      //delete on the server, if successful update client side
      $http.delete('/api/groups/' + entry._id).
      success(function(response) {
         console.log("<< DELETE/SUCCESS. Server Response: " + JSON.stringify(response));
         if (response.success) { // If the delete operation was successful...
            service.entries = _.reject(service.entries, function(element) { // Remove the document from the client-side cache
               return element._id == entry._id;
            });
         }
      }).
      error(function(response, status) {
         alert('Delete error!');
      })
   }
   return service;
});

/*
 *=====  Memberships Service: provides access to the tenants  =====
 */
partBaseApp.factory('Memberships', function($http) {

   // --- Initialization, executed during a page refresh
   var service = {}; // Reset the service object
   service.entries = []; // Reset the the array of documents

   console.log('<< Memberships SERVICE initialized');


   // ---- METHODS ----
   service.create = function(entry) {
      console.log('<< CLIENT REGISTER NEW Membership: >>' + JSON.stringify(entry));
      $http.post('/api/memberships', entry).
      success(function(response) {
         console.log("SUCCESSFUL. Server Response: " + JSON.stringify(response));
      }).
      error(function(data, status) {
         alert('New entry error!');
      });
   }

   service.flush = function() {
      console.log('<< FLUSH memberships');
      service.entries = []; // Clear out cache
   }

   //----- Read in all documents via http GET
   service.list = function() {
      //----- HTTP Get data
      $http.get('/api/memberships').
      success(function(response) { // If GET is successful...
         service.entries = response;
         service.entries.forEach(function(element) { // loop over all documents
            element.createdDate = new Date(element.createdDate); //convert date strings to Date objects
         });
      }).
      error(function(response, status) { // Otherwise, error during GET
         console.log('<< memberships: ERR: During CLIENT GETting memberships');
      });
   }

   service.list(); // Call the server and read in all the documents

   //----- delete an entry
   service.delete = function(entry) {
      //delete on the server, if successful update client side
      $http.delete('/api/memberships/' + entry._id).
      success(function(response) {
         console.log("<< DELETE/SUCCESS. Server Response: " + JSON.stringify(response));
         if (response.success) { // If the delete operation was successful...
            service.entries = _.reject(service.entries, function(element) { // Remove the document from the client-side cache
               return element._id == entry._id;
            });
         }
      }).
      error(function(response, status) {
         alert('Delete error!');
      })
   }
   return service;
});


/*
 *=====  Tenants Service: provides access to the tenants  =====
 */
partBaseApp.factory('Tenants', function($http) {

   // --- Initialization, executed during a page refresh
   var service = {}; // Reset the service object
   service.entries = []; // Reset the the array of documents

   console.log('<< Tenants SERVICE initialized');


   // ---- METHODS ----
   service.create = function(entry) {
      console.log('<< CLIENT REGISTER NEW Tenant: >>' + JSON.stringify(entry));
      $http.post('/api/tenants', entry).
      success(function(response) {
         console.log("SUCCESSFUL. Server Response: " + JSON.stringify(response));
      }).
      error(function(data, status) {
         alert('New entry error!');
      });
   }

   service.flush = function() {
      console.log('<< FLUSH Tenant');
      service.entries = []; // Clear out cache
   }

   //----- Read in all documents via http GET
   service.list = function() {
      //----- HTTP Get data
      $http.get('/api/tenants').
      success(function(response) { // If GET is successful...
         service.entries = response;
         service.entries.forEach(function(element) { // loop over all documents
            element.createdDate = new Date(element.createdDate); //convert date strings to Date objects
         });
      }).
      error(function(response, status) { // Otherwise, error during GET
         console.log('<< TenantS: ERR: During CLIENT GETting tenants');
      });
   }

   service.list(); // Call the server and read in all the documents

   //----- delete an entry
   service.delete = function(entry) {
      //delete on the server, if successful update client side
      $http.delete('/api/tenants/' + entry._id).
      success(function(response) {
         console.log("<< DELETE/SUCCESS. Server Response: " + JSON.stringify(response));
         if (response.success) { // If the delete operation was successful...
            service.entries = _.reject(service.entries, function(element) { // Remove the document from the client-side cache
               return element._id == entry._id;
            });
         }
      }).
      error(function(response, status) {
         alert('Delete error!');
      })
   }
   return service;
});

/*
 * =====  USERS Service: provides access to the users  =====
 */
partBaseApp.factory('Users', function($http, ENV, $location) {

   // --- Initialization, executed during a page refresh
   var service = {}; // Reset the service object
   service.entries = []; // Reset the the array of documents

   console.log('<< Users SERVICE initialized');


   // ---- METHODS ----


   //----- Read in all documents via http GET
   service.list = function() {
      //----- HTTP Get data
      $http.get('/api/accounts').
      success(function(response) { // If GET is successful...
         service.entries = response;
         //service.entries.forEach(function(element) { // loop over all documents
         //   element.createdDate = new Date(element.createdDate); //convert date strings to Date objects
         //});
      }).
      error(function(response, status) { // Otherwise, error during GET
         console.log('<< Users: ERR: During CLIENT GETting documents.  Status: ' + status);
         $location.path('/login');     // TODO  need to check what err code here to decide what to do.
      });
   }

   service.list(); // Call the server and read in all the    documents


   service.flush = function() {
      console.log('<< FLUSH Users');
      service.entries = []; // Clear out cache
   }

   //----- delete an entry
   service.delete = function(entry) {
      //delete on the server, if successful update client side
      $http.delete('/api/accounts/' + entry._id ).
      success(function(response) {
         console.log("<< DELETE/SUCCESS. Server Response: " + JSON.stringify(response));
         if (response.success) { // If the delete operation was successful...
            service.entries = _.reject(service.entries, function(element) { // Remove the document from the client-side cache
               return element._id == entry._id;
            });
         }
      }).
      error(function(response, status) {
         alert('Delete error!');
      })
   }
   return service;
});

/*
 * =====  DOCUMENTS Service: provides access to the client-side =====
 */
partBaseApp.factory('Documents', function($http, ENV, $location) {

   // --- Initialization, executed during a page refresh
   var service = {}; // Reset the service object
   service.entries = []; // Reset the the array of documents

   console.log('<< Documents SERVICE initialized');
   // readAll() is executed below, after the method is defined....hmmm

   // ---- METHODS ----

   //----- Read in all documents via http GET
   service.readAll = function() {

      //----- HTTP Get data
      $http.get('/api/documents').
      success(function(response) { // If GET is successful...
         service.entries = response;
         console.log('<< CLIENT GOT DATA');

         service.entries.forEach(function(element) { // loop over all documents
            element.createdDate = new Date(element.createdDate); //convert date strings to Date objects
         });

      }).
      error(function(response, status) { // Otherwise, error during GET
         console.log('<< Documents: ERR: During CLIENT GETting documents');
         $location.path('/login');     // TODO  need to check what status code here to decide what to do: redirect to login or alert
      });
   }


   service.readAll(); // Call the server and read in all the documents


   service.flush = function() {
      console.log('<< FLUSH Documents');
      service.entries = []; // Clear out cache
   }


   //----- Helper function to find an entry by id in the client array, using underscore.js
   service.getById = function(id) {
      console.log("<< Document Service: service.getById(" + id + ")");

      //find retrieves the first entry that passes the condition.
      var entry = _.find(service.entries, function(entry) { // Underscore library
         return entry._id == id; //  Matching condition
      });

      return entry;
   }

   //----- update an entry
   service.save = function(entry) {
      //find element we want to update
      var toUpdate = service.getById(entry._id);

      if (toUpdate) { //if it exists, we update

         console.log('<< CLIENT UPDATE: ' + JSON.stringify(entry));
         $http.post('/api/documents/' + entry._id, entry). //update in the server
         success(function(data) {
            if (data.success) {
               //copy all the properties from "entry" to the object we want to update
               _.extend(toUpdate, entry);
            }
         }).
         error(function(data, status) {
            alert('Update error!');
         });
      } else { //otherwise we create it
         //push new entry to the cloud
         console.log('<< CLIENT NEW: >>' + JSON.stringify(entry));
         $http.post('/api/documents', entry).
         success(function(response) {
            console.log("CREATE/SUCCESS. Server Response: " + JSON.stringify(response));
            service.entries.push(response); // Push new document sent back by server
         }).
         error(function(data, status) {
            alert('New entry error!');
         });
      }
   }

   //----- delete an entry
   service.delete = function(entry) {
      //delete on the server, if successful update client side
      $http.delete('/api/documents/' + entry._id).
      success(function(response) {
         console.log("<< DELETE/SUCCESS. Server Response: " + JSON.stringify(response));
         if (response.success) { // If the delete operation was successful...
            service.entries = _.reject(service.entries, function(element) { // Remove the document from the client-side cache
               return element._id == entry._id;
            });
         }
      }).
      error(function(response, status) {
         alert('Delete error!');
      })
   }

   return service;
});
