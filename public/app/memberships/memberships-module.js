angular.module('membershipsModule', [])

// --- memberships LIST controller ---
.controller('membershipsListCtrl', ['membershipsService', '$location',
   function(membershipsService, $location) {
      var self = this; // Capture scope
      var Service = membershipsService;

      // --- Init
      self.items = [];
      self.itemCount = null;

      // --- Reading operation
      self.list = function() {
         Service.list().
         success(function(response) {
            self.items = response;
            console.log('Memberships: ' + JSON.stringify(response));
         }).
         error(function(response, status) { // Otherwise, error during GET
            console.log('ERR: list(): Status: ' + status);
         });
      }

      self.count = function() {
         Service.count().success(function(response) {
            self.itemCount = response.count;
         }).
         error(function(response, status) { // Otherwise, error during GET
            console.log('ERR: count(): Status: ' + status);
         });
      }

      // Init
      self.list();
      self.count();

      // --- Bulk operations on a selection
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
      }

      // --- Single item operation
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
   }
])

/*
 *=====  Memberships Service: provides access to the memberships  =====
 */

.factory('membershipsService', function($http) {

   // --- Initialization, executed during a page refresh
   var service = {}; // Reset the service object
   var path = '/api/memberships/';

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
