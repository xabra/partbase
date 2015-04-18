'use strict';

var express = require('express');
var router = express.Router();
var authentication = require('./authentication-controller');


router.post('/api/authenticate', authentication.authenticateAccount);    //
router.post('/api/register', authentication.registerNewAccount);            //
router.get('/api/logout', authentication.logout);                 // 

module.exports = router;
