/* Controllers */

var partBaseControllers = angular.module('partBaseControllers', []);

// --- NavBar View Controller ---
partBaseControllers.controller('navbarCtrl', ['$scope', '$location', 'Authentication',
   function($scope, $location, Authentication) {

      $scope.logout = function() {   // If logout command...
         Authentication.logout();      // The the Authentication service to logout: wipe client-side data caches
         $location.path('/login');     // Redirect to the login view
      }
   }
]);

// --- Login View Controller ---
partBaseControllers.controller('loginCtrl', ['$scope', '$location', '$http', 'Authentication',
   function($scope, $location, $http, Authentication) {
      // Initialization
      $scope.user = { email: '', password: ''};

      //TODO give feedback on failed login

      $scope.login = function() {      // When the login button is clicked...
         var authRequest = {     // Create an auth request from the form fields supplied by user
            username: $scope.user.email,     // Stormpath expects an authRequest object with a 'username' key
            password: $scope.user.password
         };
         console.log("CLIENT: Attempting to authenticate with: " + JSON.stringify(authRequest));
         Authentication.authenticate(authRequest);
         // TODO: Handle errors and redirects here
      };

   }
]);

// --- Register View Controller ---
partBaseControllers.controller('registerCtrl', ['$scope', '$location', '$http','Authentication',
   function($scope, $location, $http, Authentication) {

      $scope.user = {
         givenName: '',
         surname: '',
         organization: '',
         email: '',
         password: '',
      };

      $scope.message = '';

      //--
      $scope.register = function() {     // When the register button is clicked...
         var newAccount = {      // Create a new account object
            givenName: $scope.user.givenName,
            surname: $scope.user.surname,
            username: '',
            email: $scope.user.email,
            password: $scope.user.password,
            customData: {
               organization: $scope.user.organization
            }
         };
         console.log("Registering: " + JSON.stringify(newAccount));
         Authentication.register(newAccount);      // Invoke register on the Authentication service with the new account
         // TODO: Handle errors and redirects here
      };
   }
]);

// --- ORGANIZATIONS list controller ---
partBaseControllers.controller('organizationsListCtrl', ['$scope', 'Organizations',
   function($scope, Organizations) {
      $scope.organizations = Organizations.entries;

      //I DONT UNDERSTAND THIS !! --we need to watch the list of documents more closely to have it always updated ---
      $scope.$watch(function() {
         return Organizations.entries;
      }, function(entries) {
         $scope.organizations = entries;
      });
   }
]);

// --- ORGANIZATIONS create Controller ---
partBaseControllers.controller('organizationsCreateCtrl', ['$scope', '$location', 'Organizations',
   function($scope, $location, Organizations) {
      //--
      $scope.create = function() {
         console.log("Creating New Organization: " + JSON.stringify($scope.organization));
         Organizations.create($scope.organization);
         $location.path('/organizations/list'); //Send user back to the root
      };
   }
]);

// --- USERS list controller ---
partBaseControllers.controller('usersListCtrl', ['$scope', 'Users',
   function($scope, Users) {
      $scope.users = Users.entries;

      //I DONT UNDERSTAND THIS !! --we need to watch the list of documents more closely to have it always updated ---
      $scope.$watch(function() {
         return Users.entries;
      }, function(entries) {
         $scope.users = entries;
      });
   }
]);


// --- Document list controller ---
partBaseControllers.controller('docListCtrl', ['$scope', 'Documents',
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
partBaseControllers.controller('docEditCtrl', ['$scope', '$routeParams', '$location', 'Documents',
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
partBaseControllers.controller('docDetailCtrl', ['$scope', '$routeParams', '$location', 'Documents',
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
