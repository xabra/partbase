'use strict';

var express = require('express');
var router = express.Router();

var accounts = require('./accounts-controller');

// -- Standard CRUD routes
router.get('/api/accounts/count', accounts.count());
router.get('/api/accounts', accounts.getList());
router.get('/api/accounts/:itemId', accounts.getById());
router.delete('/api/accounts/:itemId', accounts.deleteById());
router.put('/api/accounts/:itemId', accounts.updateById);

// -- Authentication routes
router.post('/api/accounts/authenticate', accounts.authenticate);    //
router.post('/api/accounts/register', accounts.register);            //
router.get('/api/accounts/logout', accounts.logout);                 //

// -- Groups & Memberships routes
router.get('/api/accounts/:itemId/groups', accounts.getAccountGroupsList);
router.get('/api/accounts/:itemId/memberships', accounts.getAccountMembershipsList);


module.exports = router;
