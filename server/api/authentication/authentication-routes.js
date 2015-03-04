'use strict';

var express = require('express');
var router = express.Router();
var authentication = require('./authentication-logic');


router.post('/api/authenticate', authentication.authenticateAccount);    // Get a list of tenants
router.post('/api/register', authentication.createAccount);            // Delete tenant given its Id
router.get('/api/logout', authentication.logout);                 // Get tenant given its Id

module.exports = router;
