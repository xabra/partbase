// --- Groups list controller ---
angular.module('groupsModule', [])

.controller('groupsListCtrl', ['$scope', 'groupsService',
   function($scope, groupsService) {
      $scope.groups = groupsService.entries;

      //I DONT UNDERSTAND THIS !! --we need to watch the list of documents more closely to have it always updated ---
      $scope.$watch(function() {
         return groupsService.entries;
      }, function(entries) {
         $scope.groups = entries;
      });
   }
])

.factory('groupsService', function($http) {

   // --- Initialization, executed during a page refresh
   var service = {}; // Reset the service object
   service.entries = []; // Reset the the array of documents

   //console.log('<< Groups SERVICE initialized');
   console.log('<< !!! Groups-SERVICE initialized');

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
