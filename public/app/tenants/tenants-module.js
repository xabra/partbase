angular.module('tenantsModule', [])

// --- Tenants list controller ---
.controller('tenantsListCtrl', ['$scope', 'tenantsService',
   function($scope, tenantsService) {
      $scope.tenants = tenantsService.entries;

      //I DONT UNDERSTAND THIS !! --we need to watch the list of documents more closely to have it always updated ---
      $scope.$watch(function() {
         return tenantsService.entries;
      }, function(entries) {
         $scope.tenants = entries;
      });
   }
])


// --- Tenants create Controller ---
.controller('tenantCreateCtrl', ['$scope', '$location', 'tenantsService',
   function($scope, $location, tenantsService) {
      //--
      $scope.create = function() {
         console.log("Creating New Tenant: " + JSON.stringify($scope.tenant));
         tenantsService.create($scope.tenant);
         $location.path('/tenants/list'); //Send user back to the root
      };
   }
])


/*
 *=====  Tenants Service: provides access to the tenants  =====
 */
.factory('tenantsService', function($http) {

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
