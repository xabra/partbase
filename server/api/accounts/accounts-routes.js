'use strict';

var express = require('express');
var router = express.Router();

var accounts = require('./accounts-controller');

router.get('/api/accounts/count', accounts.count());
router.get('/api/accounts', accounts.getList());
router.get('/api/accounts/:itemId', accounts.getById());
router.delete('/api/accounts/:itemId', accounts.deleteById());
router.put('/api/accounts/:itemId', accounts.updateById);

 
router.post('/api/authenticate', accounts.authenticateAccount);    //
router.post('/api/register', accounts.registerAccount);            //
router.get('/api/logout', accounts.logout);                 //


module.exports = router;
