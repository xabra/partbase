'use strict';

var express = require('express');
var router = express.Router();
var accounts = require('./accounts-logic');


router.get('/api/accounts', accounts.getList);
router.get('/api/accounts/:accountId', accounts.getById);
router.delete('/api/accounts/:accountId', accounts.deleteById);
router.post('/api/accounts/:accountId', accounts.updateById);
router.post('/api/accounts', accounts.create);
// CREATE should be in the path of the object that OWNS the accounts such as directories, but that doesn't exist yet...

module.exports = router;
