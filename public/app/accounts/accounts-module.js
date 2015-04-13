angular.module('accountsModule', [])


// --- Accounts list controller ---
.controller('accountsListCtrl', ['$scope', 'accountsService', '$location',
   function($scope, accountsService, $location) {
      var self = this; // Capture scope

      // Init
      self.accounts = [];
      self.count = null;

      accountsService.count().success(function(response) {
         self.count = response.count;
      });

      accountsService.list().
      success(function(response) {
         self.accounts = response;
      }).
      error(function(response, status) { // Otherwise, error during GET
         console.log('ERR: accountsListCtrl: list(): Status: ' + status);
      });


      self.setSelectionStatus = function(status) {
         console.log("DISABLE SELECTION - TBI"+ "Set Status=" + status);
      }

      self.deleteSelection = function() {
         console.log("DELETE SELECTION - TBI");
      }

      self.setItemStatus = function(id, status) {
         console.log("ITEM ID = " + id + "Set Status=" + status);
      }

      self.deleteItem = function(id) {
         console.log("DELETE !! ITEM ID = " + id);
         accountsService.delete(id).
         success(function(response) {
            console.log("DELETE/SUCCESS. Server Response: " + JSON.stringify(response));
            if (response.success) { // If the delete operation was successful...
               //  Need to re populate the accounts array by calling list....
            };
         }).
         error(function(response, status) {
            alert('Delete error!');
         })
      }

      self.editItem = function(id) {
         console.log("EDIT ITEM ID = " + id);
      }
   }
])

// --- Account detail controller ---
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
 * =====  Accounts Service: provides access to the accounts  =====
 */
.factory('accountsService', function($http) {

   // --- Initialization, executed during a page refresh
   var service = {}; // Reset the service object

   //----- GET Number of items in the collection
   service.count = function() {
      return $http.get('/api/accounts/count'); // HTTP Get data. Return a promise
   }

   //----- GET all items
   service.list = function() {
      return $http.get('/api/accounts');
   }

   //----- GET one item by id
   service.getById = function(id) {
      return $http.get('/api/accounts/:id');
   }

   //----- DELETE an entry by _id
   service.delete = function(id) {
      return $http.delete('/api/accounts/' + id);
   }



   return service;
});
