angular.module('accountsModule', [])


// --- Accounts list controller ---
.controller('usersListCtrl', ['$scope', 'Users',
   function($scope, Users) {
      $scope.users = Users.entries;

      //I DONT UNDERSTAND THIS !! --we need to watch the list of documents more closely to have it always updated ---
      $scope.$watch(function() {
         return Users.entries;
      }, function(entries) {
         $scope.users = entries;
      });
   }
])


/*
 * =====  USERS Service: provides access to the users  =====
 */
.factory('Users', function($http, ENV, $location) {

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
