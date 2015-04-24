angular.module('accountsModule', [])


// --- Accounts LIST controller ---
.controller('accountsListCtrl', ['accountsService', '$location',
   function(accountsService, $location) {
      var self = this; // Capture scope
      var Service = accountsService;

      // --- Init
      self.items = [];
      self.itemCount = null;
      self.nextCheckAll = true;  // What will happen to the selection state next time the the "CheckAll" button is clicked

      // --- Reading operation
      self.list = function() {
         Service.list().
         success(function(response) {
            self.items = response;
         }).
         error(function(response, status) { // Otherwise, error during GET
            console.log('ERR: ListCtrl: list(): Status: ' + status);
         });
      }

      self.count = function() {
         Service.count().success(function(response) {
            self.itemCount = response.count;
         }).
         error(function(response, status) { // Otherwise, error during GET
            console.log('ERR: ListCtrl: count(): Status: ' + status);
         });
      }

      // Init
      self.list();
      self.count();

      // --- Set selection state of all items to state
      self.selectAll = function(state) {
         self.items.forEach(function(item) {
            item.selected = state;
         });
         self.nextCheckAll = !self.nextCheckAll;   // Toggle the nextCheckAll state
      }


      // --- Bulk operations on a selection
      self.setSelectionStatus = function(newStatus) {
         self.items.forEach(function(item, index) {
            if (item.selected) {
               self.setItemStatus(item._id, index, newStatus);
            }
         });
         self.nextCheckAll = true;  // item selected state will be cleared, so be ready to select all
      }

      self.deleteSelection = function() {
         var i = 0;

         var item = {};

         for (i = 0; i < self.items.length; i++) { // Loop over all items in local array
            item = self.items[i]; //Get reference to an item
            if (item.selected) { // If the item is selected...
               self.deleteItem(item._id, i); //Delete the item from DB and local array
            }
         }
         self.list();      // Refresh the local array
         self.nextCheckAll = true;  // item selected state will be cleared, so be ready to select all
      }

      // --- Single item operations
      self.setItemStatus = function(id, index, newStatus) {
         var update = {};
         update.status = newStatus;
         Service.update(id, update).
         success(function(data) {
            self.items.splice(index, 1, data); // Update local array of items...could hit the API for the full array again...
         }).
         error(function(response, status) {
            console.log("ITEM ID = " + id + "Set Status Error=" + status);
         })
      }

      self.deleteItem = function(id, index) {
         Service.delete(id).
         success(function(response) {
            self.items.splice(index, 1); //  Yank the deleted item from the local array
            self.count();
         }).
         error(function(response, status) {
            alert('Delete error!');
         })
      }

      self.editItem = function(id) {
         $location.path("/accounts/edit/" + id)
      }
   }
])

// --- Account EDIT controller ---
.controller('accountsEditCtrl', ['$routeParams', 'accountsService', '$location',
   function($routeParams, accountsService, $location) {
      var self = this; // Capture scope
      var Service = accountsService;

      // Init
      self.item = {};
      self.headingText = "";

      var id = $routeParams.itemIndex; // Get the item id from the route params

      if (id == undefined) { // CREATE a new item...
         console.log("ERROR  - Accounts can only be created by registering");
      } else { // Otherwise EDIT and existing item
         Service.getById(id).
         success(function(data) {
            self.item = data;
            self.headingText = self.item.givenName + " " + self.item.surname;
         }).
         error(function(response, status) {
            console.log('ERROR:  Could not retrieve the item');
         })
      }

      self.setItemStatus = function(newStatus) {
         self.item.status = newStatus; // Change the local value of account status, so it can be cancelled
      }

      self.save = function() {
         Service.update(self.item._id, self.item).
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
.controller('accountsDetailCtrl', ['$routeParams', 'accountsService',
   function($routeParams, accountsService) {
      var self = this; // Capture scope
      var Service = accountsService;

      // Init
      self.item = {};
      self.headingText = "";

      var id = $routeParams.itemIndex; // Get the item id from the route params

      Service.getById(id).
      success(function(data) {
         self.item = data;
         self.headingText = self.item.givenName + " " + self.item.surname;
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
   var path = '/api/accounts/';

   //----- GET Number of items in the collection
   service.count = function() {
      return $http.get(path + 'count'); // HTTP Get data. Return a promise
   }

   //----- GET all items
   service.list = function() {
      return $http.get(path);
   }

   //----- GET one item by id
   service.getById = function(id) {
      return $http.get(path + id);
   }

   //----- PUT one item by id
   service.update = function(id, data) {
      return $http.put(path + id, data);
   }

   //----- POST a new item
   service.create = function(data) {
      return $http.post(path, data);
   }

   //----- DELETE an entry by _id
   service.delete = function(id) {
      return $http.delete(path + id);
   }

   return service;
});
