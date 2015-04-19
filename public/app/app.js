// ===== client-app.js =====
// CLIENT-SIDE app module does app setup, routing and document service

// --- Set up module with dependencies
angular.module('app', [
   'ngRoute',
   'ngResource',
   'groupsModule',
   'tenantsModule',
   'membershipsModule',
   'documentsModule',
   'accountsModule',
   'navigationModule',
   'dashboardModule',
   'authenticationModule',
   'constants',
]);

// --- Route Config ---
angular.module('app').config(['$routeProvider', '$locationProvider',
   function($routeProvider, $locationProvider) {

      //$locationProvider.html5Mode(true);  TODO: tackle this URL stuff later...

      $routeProvider.
//-------- ROOT ROUTE
      when('/', {
         redirectTo: '/documents'
      }).
//-------- ACCOUNTS ROUTES
      when('/dashboard', {
         templateUrl: 'app/dashboard/dashboard.tmpl.html',
         controller: 'dashboardCtrl'
      }).
//-------- DOCUMENTS ROUTES
      when('/documents', {
         templateUrl: 'app/documents/doc-list.tmpl.html',
         controller: 'docListCtrl'
      }).
      when('/documents/new', {
         templateUrl: 'app/documents/doc-new.tmpl.html',
         controller: 'docEditCtrl'
      }).
      when('/documents/edit/:itemIndex', {
         templateUrl: 'app/documents/doc-new.tmpl.html',
         controller: 'docEditCtrl'
      }).
      when('/documents/detail/:itemIndex', {
         templateUrl: 'app/documents/doc-detail.tmpl.html',
         controller: 'docDetailCtrl'
      }).
//-------- AUTHENTICATION ROUTES
      when('/login', {
         templateUrl: 'app/authentication/login.tmpl.html',
         controller: 'loginCtrl'
      }).
      when('/register', {
         templateUrl: 'app/authentication/register.tmpl.html',
         controller: 'registerCtrl'
      }).
//-------- ACCOUNTS ROUTES
      when('/accounts', {
         templateUrl: 'app/accounts/accounts-list.tmpl.html',
         controller: 'accountsListCtrl as ctrl'
      }).
      when('/accounts/detail/:itemIndex', {
         templateUrl: 'app/accounts/account-detail.tmpl.html',
         controller: 'accountsDetailCtrl as ctrl'
      }).
      when('/accounts/edit/:itemIndex', {
         templateUrl: 'app/accounts/account-edit.tmpl.html',
         controller: 'accountsEditCtrl as ctrl'
      }).
//-------- TENANTS ROUTES
      when('/tenants', {
         templateUrl: 'app/tenants/tenants-list.tmpl.html',
         controller: 'tenantsListCtrl'
      }).
      when('/tenants/create', {
         templateUrl: 'app/tenants/tenants-create.tmpl.html',
         controller: 'tenantsCreateCtrl'
      }).
//-------- GROUPS ROUTES
      when('/groups', {
         templateUrl: 'app/groups/groups-list.tmpl.html',
         controller: 'groupsListCtrl'
      }).
//-------- MEMBERSHIPS ROUTES
      when('/memberships', {
         templateUrl: 'app/memberships/memberships-list.tmpl.html',
         controller: 'membershipsListCtrl'
      }).
//-------- DEFAULT REDIRECT ROUTE
      otherwise({
         redirectTo: '/documents'
      });
   }
]);
