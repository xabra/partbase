var groupsControllers = angular.module('groupsControllers', []);

// --- Groups list controller ---
groupsControllers.controller('groupsListCtrl', ['$scope', 'Groups',
   function($scope, Groups) {
      $scope.groups = Groups.entries;

      //I DONT UNDERSTAND THIS !! --we need to watch the list of documents more closely to have it always updated ---
      $scope.$watch(function() {
         return Groups.entries;
      }, function(entries) {
         $scope.groups = entries;
      });
   }
]);
