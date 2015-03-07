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
   'dashboardModule',
   'constants',
]);

// --- Route Config ---
angular.module('app').config(['$routeProvider', '$locationProvider',
   function($routeProvider, $locationProvider) {

      //$locationProvider.html5Mode(true);  TODO: tackle this URL bullshit later...

      $routeProvider.
      when('/', {
         redirectTo: '/documents'
      }).
      when('/dashboard', {
         templateUrl: 'app/dashboard/dashboard.tmpl.html',
         controller: 'dashboardCtrl'
      }).
      when('/documents', {
         templateUrl: 'app/documents/doc-list.tmpl.html',
         controller: 'docListCtrl'
      }).
      when('/documents/new', {
         templateUrl: 'app/documents/doc-new.tmpl.html',
         controller: 'docEditCtrl'
      }).
      when('/documents/edit/:id', {
         templateUrl: 'app/documents/doc-new.tmpl.html',
         controller: 'docEditCtrl'
      }).
      when('/documents/detail/:id', {
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
      when('/accounts', {
         templateUrl: 'app/accounts/accounts-list.tmpl.html',
         controller: 'accountsListCtrl'
      }).
      when('/tenants', {
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
         redirectTo: '/documents'
      });
   }
]);
