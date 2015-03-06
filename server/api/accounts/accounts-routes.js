'use strict';

var express = require('express');
var router = express.Router();
var Account = require('mongoose').model('Account');
var accounts = require('./accounts-logic');
var routeHandler = require('../../utilities/route-handler');

router.get('/api/accounts', routeHandler.getList(Account, accounts.mapping));
router.get('/api/accounts/:itemId', routeHandler.getById(Account, accounts.mapping));
router.delete('/api/accounts/:itemId', routeHandler.deleteById(Account));
router.post('/api/accounts/:itemId', accounts.updateById);
router.post('/api/accounts', accounts.create);

module.exports = router;
