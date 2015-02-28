// ===== index.js =====
// SERVER-SIDE Routes


var express = require('express');
var router = express.Router();


// --- Require various elements of the API
var organizations = require('./organizations');
var users = require('./users');
var documents = require('./documents');
var authenticate = require('./authenticate');

// --- Mount the various sub-routers
router.use(organizations);
router.use(users);
router.use(documents);
router.use(authenticate);

// --- Root Route
router.get('/', function(request, response) {
	response.send('Reqest to server for ROOT');
});
  

module.exports = router;
