var documentsControllers = angular.module('documentsControllers', []);

// --- Document list controller ---
documentsControllers.controller('docListCtrl', ['$scope', 'Documents',
   function($scope, Documents) {
      $scope.docs = Documents.entries;

      //I DONT UNDERSTAND THIS !! --we need to watch the list of documents more closely to have it always updated ---
      $scope.$watch(function() {
         return Documents.entries;
      }, function(entries) {
         $scope.docs = entries;
      });
   }
]);


// --- New/Edit Document View Controller ---
documentsControllers.controller('docEditCtrl', ['$scope', '$routeParams', '$location', 'Documents',
   function($scope, $routeParams, $location, Documents) {
      if (!$routeParams.id) {
         // Hmmmm  !
      } else { // Otherwise it is an EXISTING document for updating
         $scope.document = _.clone(Documents.getById($routeParams.id));
      }

      //push the expense to the array of expenses. Duplicate entries will thow error unless adding  "track by $index" to the ng-repeat directive
      $scope.save = function() {
         console.log("Saving...")
         Documents.save($scope.document);
         $location.path('/'); //Send user back to the root
      };
   }
]);

// --- Document detail controller ---
documentsControllers.controller('docDetailCtrl', ['$scope', '$routeParams', '$location', 'Documents',
   function($scope, $routeParams, $location, Documents) {
      console.log("<< docDetailCtrl: Got doc ID: " + $routeParams.id);
      //console.log("<< docDetailCtrl: Got doc ID: 4" + Documents.entries[4]);

      //I DONT UNDERSTAND THIS !! --we need to watch the list of documents more closely to have it always updated ---
      $scope.$watch(function() {
         return Documents.entries;
      }, function(entries) {
         $scope.doc = Documents.getById($routeParams.id);
         //$scope.docs = entries;
      });

      if ($routeParams.id) {
         $scope.doc = Documents.getById($routeParams.id);
      } else { // Otherwise it is an EXISTING document for updating
         // Error... handle it
         console.log("docDetailCtrl: ERR no id");
      }

      console.log("<< docDetailCtrl: Got doc ID: " + $routeParams.id + $scope.doc);

      $scope.delete = function() {
         console.log("<< docDetailCtrl: Deleteing " + $scope.doc);
         Documents.delete($scope.doc);
         $location.path('/'); //Send user back to the root
      };
   }
]);
