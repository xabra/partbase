// ===== index.js =====
// SERVER-SIDE Routes


var express = require('express');
var router = express.Router();


// --- Require various elements of the API
//var organizations = require('../organizations');
var tenantsRoutes = require('../api/tenants/tenants-routes');
var accountsRoutes = require('../api/accounts/accounts-routes');
var documentsRoutes = require('../api/documents/documents-routes');
var groupsRoutes = require('../api/groups/groups-routes');
var membershipsRoutes = require('../api/memberships/memberships-routes');
var authenticationRoutes = require('../api/authentication/authentication-routes');

// --- Mount the various sub-routers
router.use(tenantsRoutes);
router.use(accountsRoutes);
router.use(documentsRoutes);
router.use(groupsRoutes);
router.use(membershipsRoutes);
router.use(authenticationRoutes);

// --- Root Route
router.get('/', function(request, response) {
	response.send('Reqest to server for ROOT');
});


module.exports = router;
