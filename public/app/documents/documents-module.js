angular.module('documentsModule', [])

// --- documents LIST controller ---
.controller('documentsListCtrl', ['documentsService', '$location',
   function(documentsService, $location) {
      var self = this; // Capture scope
      var Service = documentsService;

      // --- Init
      self.items = [];
      self.itemCount = null;

      // --- Reading operation
      self.list = function() {
         Service.list().
         success(function(response) {
            self.items = response;
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

      // --- Single item operations

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
         $location.path("/documents/edit/" + id)
      }
   }
])

// --- document EDIT controller ---
.controller('documentsEditCtrl', ['$routeParams', 'documentsService', '$location',
   function($routeParams, documentsService, $location) {
      var self = this; // Capture scope
      var Service = documentsService;

      // Init
      self.item = {};
      self.headingText = "";

      var id = $routeParams.itemIndex; // Get the item id from the route params

      if (id == undefined || id < 1) { // CREATE a new item...
         self.headingText = "New Document";

      } else { // Otherwise EDIT and existing item
         Service.getById(id).
         success(function(data) {
            self.item = data;
            self.headingText = self.item.title;
         }).
         error(function(response, status) {
            console.log('ERROR:  Could not retrieve the item');
         })
      }

      self.save = function() {
         if(id == undefined || id < 1) {  // CREATING a new record
            Service.create(self.item).
            success(function(data) {
               console.log("ITEM " + id + " CREATED: " + JSON.stringify(data));
               $location.path('/documents')
            }).
            error(function(response, status) {
               console.log("CREATE Error=" + status);
            })
         } else{     // UPDATING an existing record
            Service.update(self.item._id, self.item).
            success(function(data) {
               console.log("ITEM " + id + " UPDATED");
               $location.path('/documents')
            }).
            error(function(response, status) {
               console.log("ITEM " + id + "Save Error=" + status);
            })
         }
      }
   }
])

// --- document DETAIL controller ---
.controller('documentsDetailCtrl', ['$routeParams', 'documentsService',
   function($routeParams, documentsService) {
      var self = this; // Capture scope
      var Service = documentsService;

      // Init
      self.item = {};
      self.headingText = "";

      var id = $routeParams.itemIndex; // Get the item id from the route params

      Service.getById(id).
      success(function(data) {
         self.item = data;
         self.headingText = self.item.title;
      }).
      error(function(response, status) {
         console.log('ERROR:  Could not retrieve the item');
      })
   }
])

/*
 *=====  Documents Service: provides access to the documents  =====
 */

.factory('documentsService', function($http) {

   // --- Initialization, executed during a page refresh
   var service = {}; // Reset the service object
   var path = '/api/documents/';

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
