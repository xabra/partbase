var tenantsControllers = angular.module('tenantsControllers', []);

// --- Tenants list controller ---
tenantsControllers.controller('tenantsListCtrl', ['$scope', 'Tenants',
   function($scope, Tenants) {
      $scope.tenants = Tenants.entries;

      //I DONT UNDERSTAND THIS !! --we need to watch the list of documents more closely to have it always updated ---
      $scope.$watch(function() {
         return Tenants.entries;
      }, function(entries) {
         $scope.tenants = entries;
      });
   }
]);


// --- Tenants create Controller ---
tenantsControllers.controller('tenantCreateCtrl', ['$scope', '$location', 'Tenants',
   function($scope, $location, Tenants) {
      //--
      $scope.create = function() {
         console.log("Creating New Tenant: " + JSON.stringify($scope.tenant));
         Tenants.create($scope.tenant);
         $location.path('/tenants/list'); //Send user back to the root
      };
   }
]);
