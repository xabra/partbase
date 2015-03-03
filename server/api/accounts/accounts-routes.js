'use strict';

var express = require('express');
var router = express.Router();
var accounts = require('./accounts-logic');


router.get('/api/accounts', accounts.getAccounts);
router.get('/api/account/:accountId', accounts.getAccount);
router.delete('/api/account/:accountId', accounts.deleteAccount);
router.post('/api/account/:accountId', accounts.updateAccount);
router.post('/api/accounts', accounts.createAccount);
// CREATE should be in the path of the object that OWNS the accounts such as directories, but that doesn't exist yet...

module.exports = router;
