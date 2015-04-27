angular.module('groupsModule', [])

// --- groups LIST controller ---
.controller('groupsListCtrl', ['groupsService', '$location',
   function(groupsService, $location) {
      var self = this; // Capture scope
      var Service = groupsService;

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
         $location.path("/groups/edit/" + id)
      }
   }
])

// --- item EDIT controller ---
.controller('groupsEditCtrl', ['$routeParams', 'groupsService', '$location',
   function($routeParams, groupsService, $location) {
      var self = this; // Capture scope
      var Service = groupsService;

      // Init
      self.item = {};
      self.headingText = "";

      var id = $routeParams.itemIndex; // Get the item id from the route params

      if (id == undefined || id < 1) { // CREATE a new item...
         self.headingText = "New Group";
         self.item.status = 'ENABLED';

      } else { // Otherwise EDIT and existing item
         Service.getById(id).
         success(function(data) {
            self.item = data;
            self.headingText = self.item.name;
         }).
         error(function(response, status) {
            console.log('ERROR:  Could not retrieve the item');
         })
      }

      self.setItemStatus = function(newStatus) {
         self.item.status = newStatus; // Change the local value of item status, so it can be cancelled
      }

      self.save = function() {
         if(id == undefined || id < 1) {  // CREATING a new record
            Service.create(self.item).
            success(function(data) {
               console.log("ITEM " + id + " CREATED: " + JSON.stringify(data));
               $location.path('/groups')
            }).
            error(function(response, status) {
               console.log("CREATE Error=" + status);
            })
         } else{     // UPDATING an existing record
            console.log("WILL UPDATE ITEM " + id + ", GROUP = "+ JSON.stringify(self.item));
            Service.update(self.item._id, self.item).
            success(function(data) {
               console.log("ITEM " + id + " UPDATED");
               $location.path('/groups')
            }).
            error(function(response, status) {
               console.log("ITEM " + id + " Save Error=" + status);
            })
         }
      }
   }
])

// --- group DETAIL controller ---
.controller('groupsDetailCtrl', ['$routeParams', 'groupsService', 'accountsService', 'membershipsService',
   function($routeParams, groupsService, accountsService, membershipsService) {
      var self = this; // Capture scope
      var Service = groupsService;

      // Init
      self.item = {};      // Ths group
      self.headingText = "";
      self.accounts = [];     // List of accounts belonging to this group
      self.otherAccounts = [];   // List of accounts to populate dropdown menus for adding otehr Accounts to groups

      var id = $routeParams.itemIndex; // Get the item id from the route params

      Service.getById(id).
      success(function(data) {
         self.item = data;
         self.headingText = self.item.name;
      }).
      error(function(response, status) {
         console.log('ERROR:  Could not retrieve the item');
      })

      self.getGroupAccountsList = function(id){
         Service.getGroupAccountsList(id).
         success(function(data){
            self.accounts = data;
            accountsService.list().
            success(function(other){
               self.otherAccounts = arrayReject(other, self.accounts, function(a1, a2) {return a1._id == a2._id})
               console.log('ACCOUNTS:: ' + JSON.stringify(data));
            }).
            error(function(response, status) {
               console.log('ERR: ListCtrl: list(): Status: ' + status);
            })
         }).
         error(function(response, status) {
            console.log('ERR: ListCtrl: list(): Status: ' + status);
         })
      }

      var arrayReject = function(arr1, arr2, test){

         //TODO  Put this function in a common utilities module  - see identical code in accounts-module.js
         result = [];

         for(var i=0; i<arr1.length; i++) {

            match = false;
            for(var j=0; j<arr2.length; j++){
               if(test(arr1[i], arr2[j])) {
                  match = true;
                  break;
               }
            }
            if(!match) {result.push(arr1[i]);}
         }
         return result;
      }

      self.getGroupAccountsList(id);

      self.addAccount = function(accountId) {
         membershipsService.create({accountId: accountId, groupId: self.item._id}).
         success(function(data){
            console.log('ADDED ACCOUNT: ' + JSON.stringify(data));
            self.getGroupAccountsList(self.item._id);    // Refresh the group accounts list from the DB
            //self.getOtherAccountsList(); // Refresh the otherAccounts list here too
         }).
         error(function(response, status) {
            console.log('ERR: ' + status);
         })
      }

      self.removeGroupAccount = function(accountId) {
         console.log('REMOVING GROUP/ACCOUNT IDs: '+ self.item._id +' / ' + accountId);
         groupsService.deleteGroupAccount(self.item._id, accountId).
         success(function(data){
            console.log('DELETED ACCOUNT: ' + JSON.stringify(data));
            self.getGroupAccountsList(self.item._id);    // Refresh the group accounts list from the DB
         }).
         error(function(response, status) {
            console.log('ERR: ' + status);
         })
      }
   }
])

/*
 *=====  Tenants Service: provides access to the groups  =====
 */

.factory('groupsService', function($http) {

   // --- Initialization, executed during a page refresh
   var service = {}; // Reset the service object
   var path = '/api/groups/';

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

   //----- GET the list of accounts associated with this group id
   service.getGroupAccountsList = function(id) {
      return $http.get(path + id + '/accounts');
   }

   //----- DELETE account associated with this group id
   service.deleteGroupAccount = function(groupId, accountId) {
      return $http.delete(path + groupId + '/accounts/' + accountId);
   }

   return service;
});
