angular.module('accountsModule', [])


// --- Accounts LIST controller ---
.controller('accountsListCtrl', ['$scope', 'accountsService', '$location',
   function($scope, accountsService, $location) {
      var self = this; // Capture scope

      // --- Init
      self.accounts = [];
      self.itemCount = null;

      // --- Reading operation
      self.list = function() {
         accountsService.list().
         success(function(response) {
            self.accounts = response;
         }).
         error(function(response, status) { // Otherwise, error during GET
            console.log('ERR: accountsListCtrl: list(): Status: ' + status);
         });
      }

      self.count = function() {
         accountsService.count().success(function(response) {
            self.itemCount = response.count;
            console.log('accountsListCtrl: count() = : ' + response.count);
         }).
         error(function(response, status) { // Otherwise, error during GET
            console.log('ERR: accountsListCtrl: count(): Status: ' + status);
         });
      }

      // Init
      self.list();
      self.count();

      // --- Bulk operations on a selection
      self.setSelectionStatus = function(status) {
         console.log("DISABLE SELECTION - TBI" + "Set Status=" + status);
      }

      self.deleteSelection = function() {
         console.log("DELETE SELECTION - TBI");
      }



      // --- Single item operations
      self.setItemStatus = function(id, index, newStatus) {
         var update = {};
         update.status = newStatus;
         accountsService.update(id, update).
         success(function(data) {
            self.accounts.splice(index, 1, data); // Update local array of items...could hit the API for the full array again...
         }).
         error(function(response, status) {
            //
            console.log("ITEM ID = " + id + "Set Status Error=" + status);
         })
      }

      self.deleteItem = function(id, index) {
         console.log("DELETE ITEM ID = " + id);
         accountsService.delete(id).
         success(function(response) {
            console.log("DELETE SUCCESSFUL");
            self.accounts.splice(index, 1); //  Yank the deleted item from the local array
            self.count();
         }).
         error(function(response, status) {
            alert('Delete error!');
         })
      }

      self.editItem = function(id) {
         console.log("EDIT ITEM ID = " + id);
         $location.path("/accounts/edit/" + id)
      }
   }
])

// --- Account EDIT controller ---
.controller('accountsEditCtrl', ['$scope', '$routeParams', 'accountsService', '$location',
   function($scope, $routeParams, accountsService, $location) {
      var self = this; // Capture scope

      // Init
      self.account = {};
      self.headingText = "";

      var id = $routeParams.itemIndex; // Get the item id from the route params

      if (id == undefined) { // CREATE a new item...
         console.log("Create a new account...");
         self.headingText = "New User";

      } else { // Otherwise EDIT and existing item
         console.log("Edit Existing Account id =" + id);
         accountsService.getById(id).
         success(function(data) {
            self.account = data;
            self.headingText = self.account.givenName + " " + self.account.surname;
         }).
         error(function(response, status) {
            console.log('ERROR:  Could not retrieve the item');
         })
      }

      self.setItemStatus = function(newStatus) {
         self.account.status = newStatus; // Change the local value of account status, so it can be cancelled
      }

      self.save = function() {
         accountsService.update(self.account._id, self.account).
         success(function(data) {
            console.log("ITEM " + id + " UPDATED");
            $location.path('/accounts')
         }).
         error(function(response, status) {
            console.log("ITEM " + id + "Save Error=" + status);
         })
      }
   }
])

// --- Account DETAIL controller ---
.controller('accountsDetailCtrl', ['$scope', '$routeParams', 'accountsService',
   function($scope, $routeParams, accountsService) {
      var self = this; // Capture scope

      // Init
      self.account = {};
      self.headingText = "";

      var id = $routeParams.itemIndex; // Get the item id from the route params

      accountsService.getById(id).
      success(function(data) {
         self.account = data;
         self.headingText = self.account.givenName + " " + self.account.surname;
      }).
      error(function(response, status) {
         console.log('ERROR:  Could not retrieve the item');
      })
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
      return $http.get('/api/accounts/' + id);
   }

   //----- PUT one item by id
   service.update = function(id, data) {
      return $http.put('/api/accounts/' + id, data);
   }

   //----- POST a new item
   service.create = function(data) {
      return $http.post('/api/accounts/', data);
   }

   //----- DELETE an entry by _id
   service.delete = function(id) {
      return $http.delete('/api/accounts/' + id);
   }



   return service;
});
