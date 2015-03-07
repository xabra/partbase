// ===== client-app.js =====
// CLIENT-SIDE app module does app setup, routing and document service

// --- Set up module with dependencies
angular.module('app', [
   'ngRoute',
   'groupsModule',
   'tenantsModule',
   'membershipsModule',
   'documentsModule',
   'accountsModule',
   'authenticationModule',
   'navigationModule',
   'constants',
]);

// --- Route Config ---
angular.module('app').config(['$routeProvider', '$locationProvider',
   function($routeProvider, $locationProvider) {

      //$locationProvider.html5Mode(true);  TODO: tackle this URL bullshit later...

      $routeProvider.
      when('/', {
         redirectTo: '/docs'
      }).
      when('/docs', {
         templateUrl: 'app/documents/doc-list.tmpl.html',
         controller: 'docListCtrl'
      }).
      when('/docs/new', {
         templateUrl: 'app/documents/doc-new.tmpl.html',
         controller: 'docEditCtrl'
      }).
      when('/docs/edit/:id', {
         templateUrl: 'app/documents/doc-new.tmpl.html',
         controller: 'docEditCtrl'
      }).
      when('/docs/detail/:id', {
         templateUrl: 'app/documents/doc-detail.tmpl.html',
         controller: 'docDetailCtrl'
      }).
      when('/login', {
         templateUrl: 'app/authentication/login.tmpl.html',
         controller: 'loginCtrl'
      }).
      when('/register', {
         templateUrl: 'app/authentication/register.tmpl.html',
         controller: 'registerCtrl'
      }).
      when('/users/list', {
         templateUrl: 'app/accounts/accounts-list.tmpl.html',
         controller: 'usersListCtrl'
      }).
      when('/tenants/list', {
         templateUrl: 'app/tenants/tenants-list.tmpl.html',
         controller: 'tenantsListCtrl'
      }).
      when('/tenants/create', {
         templateUrl: 'app/tenants/tenants-create.tmpl.html',
         controller: 'tenantsCreateCtrl'
      }).
      when('/groups', {
         templateUrl: 'app/groups/groups-list.tmpl.html',
         controller: 'groupsListCtrl'
      }).
      when('/memberships', {
         templateUrl: 'app/memberships/memberships-list.tmpl.html',
         controller: 'membershipsListCtrl'
      }).
      otherwise({
         redirectTo: '/docs'
      });
   }
]);
