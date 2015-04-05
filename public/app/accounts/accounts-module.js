angular.module('accountsModule', [])


// --- Accounts list controller ---
.controller('accountsListCtrl', ['$scope', 'accountsService', '$location',
   function($scope, accountsService, $location) {
      $scope.accounts = accountsService.entries;

      //I DONT UNDERSTAND THIS !! --we need to watch the list of documents more closely to have it always updated ---
      $scope.$watch(function() {
         return accountsService.entries;
      }, function(entries) {
         $scope.accounts = entries;
      });

   }
])

// --- Accounts list controller ---
.controller('accountsDetailCtrl', ['$scope', '$routeParams', 'accountsService',
   function($scope, $routeParams, accountsService) {
      $scope.accounts = accountsService.entries;

      //I DONT UNDERSTAND THIS !! --we need to watch the list of documents more closely to have it always updated ---

      $scope.$watch(function() {
         return accountsService.entries;
      }, function(entries) {
         $scope.accounts = entries;
      });

      var idx = $routeParams.itemIndex;
      console.log("itemIndex = " + idx);
      if (idx) {
         $scope.account = $scope.accounts[idx]
         console.log("account = " + JSON.stringify($scope.account));
      } else { // Otherwise it is an EXISTING document for updating
         // Error... handle it
         console.log("docDetailCtrl: ERR no id");
      }
   }
])


/*
 * =====  accountS Service: provides access to the accounts  =====
 */
.factory('accountsService', function($http, ENV, $location) {

   // --- Initialization, executed during a page refresh
   var service = {}; // Reset the service object
   service.entries = []; // Reset the the array of documents

   console.log('<< Accounts SERVICE initialized');


   // ---- METHODS ----


   //----- Read in all documents via http GET
   service.list = function() {
      //----- HTTP Get data
      $http.get('/api/accounts').
      success(function(response) { // If GET is successful...
         service.entries = response;
         console.log('<< Accounts SERVICE got data: ' + JSON.stringify(service.entries));
         //service.entries.forEach(function(element) { // loop over all documents
         //   element.createdDate = new Date(element.createdDate); //convert date strings to Date objects
         //});
      }).
      error(function(response, status) { // Otherwise, error during GET
         console.log('<< Accounts: ERR: During CLIENT GETting documents.  Status: ' + status);
         $location.path('/login');     // TODO  need to check what err code here to decide what to do.
      });
   }

   service.list(); // Call the server and read in all the accounts


   service.flush = function() {
      console.log('<< FLUSH accounts');
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

   //----- Helper function to find an entry by id in the client array, using underscore.js
   service.getById = function(id) {
      console.log("<< Accounts Service: service.getById(" + id + ")");

      //find retrieves the first entry that passes the condition.
      var entry = _.find(service.entries, function(entry) { // Underscore library
         return entry._id == id; //  Matching condition
      });

      return entry;
   }

   //----- Helper function to find an entry by id in the client array, using underscore.js
   service.getByIndex = function(index) {
      console.log("<< Accounts Service: service.getByIndex(" + index + ")");

      return service.entries[index];
   }


   return service;
});
