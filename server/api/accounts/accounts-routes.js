'use strict';

var express = require('express');
var router = express.Router();

var accounts = require('./accounts-controller');

router.get('/api/accounts/count', accounts.count());
router.get('/api/accounts', accounts.getList());
router.get('/api/accounts/:itemId', accounts.getById());
router.delete('/api/accounts/:itemId', accounts.deleteById());
router.put('/api/accounts/:itemId', accounts.apiUpdateById);

// -- Groups api functions
/*
router.get('/api/accounts/:accountId/groups', accounts.getGroupsList());

router.get('/api/accounts/:accountId/groups/:groupsId', accounts.getGroup());

*/
router.post('/api/accounts/:accountId/groups/:groupsId', accounts.joinGroup);


router.post('/api/accounts/authenticate', accounts.authenticate);    //
router.post('/api/accounts/register', accounts.register);            //
router.get('/api/accounts/logout', accounts.logout);                 //


module.exports = router;
