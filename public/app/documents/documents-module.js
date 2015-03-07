

// --- Document list controller ---
angular.module('documentsModule', [])

.controller('docListCtrl', ['$scope', 'documentsService',
   function($scope, documentsService) {
      $scope.docs = documentsService.entries;

      //I DONT UNDERSTAND THIS !! --we need to watch the list of documents more closely to have it always updated ---
      $scope.$watch(function() {
         return documentsService.entries;
      }, function(entries) {
         $scope.docs = entries;
      });
   }
])


// --- New/Edit Document View Controller ---
.controller('docEditCtrl', ['$scope', '$routeParams', '$location', 'documentsService',
   function($scope, $routeParams, $location, documentsService) {
      if (!$routeParams.id) {
         // Hmmmm  !
      } else { // Otherwise it is an EXISTING document for updating
         $scope.document = _.clone(documentsService.getById($routeParams.id));
      }

      //push the expense to the array of expenses. Duplicate entries will thow error unless adding  "track by $index" to the ng-repeat directive
      $scope.save = function() {
         console.log("Saving...")
         documentsService.save($scope.document);
         $location.path('/'); //Send user back to the root
      };
   }
])

// --- Document detail controller ---
.controller('docDetailCtrl', ['$scope', '$routeParams', '$location', 'documentsService',
   function($scope, $routeParams, $location, documentsService) {
      console.log("<< docDetailCtrl: Got doc ID: " + $routeParams.id);
      //console.log("<< docDetailCtrl: Got doc ID: 4" + Documents.entries[4]);

      //I DONT UNDERSTAND THIS !! --we need to watch the list of documents more closely to have it always updated ---
      $scope.$watch(function() {
         return documentsService.entries;
      }, function(entries) {
         $scope.doc = documentsService.getById($routeParams.id);
         //$scope.docs = entries;
      });

      if ($routeParams.id) {
         $scope.doc = documentsService.getById($routeParams.id);
      } else { // Otherwise it is an EXISTING document for updating
         // Error... handle it
         console.log("docDetailCtrl: ERR no id");
      }

      console.log("<< docDetailCtrl: Got doc ID: " + $routeParams.id + $scope.doc);

      $scope.delete = function() {
         console.log("<< docDetailCtrl: Deleteing " + $scope.doc);
         documentsService.delete($scope.doc);
         $location.path('/'); //Send user back to the root
      };
   }
])

/*
 * =====  DOCUMENTS Service: provides access to the client-side =====
 */
.factory('documentsService', function($http, ENV, $location) {

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
