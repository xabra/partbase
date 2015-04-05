'use strict';

var express = require('express');
var router = express.Router();

var accounts = require('./accounts-controller');


router.get('/api/accounts', accounts.getList());
router.get('/api/accounts/:itemId', accounts.getById());
router.delete('/api/accounts/:itemId', accounts.deleteById());
router.post('/api/accounts/:itemId', accounts.updateById);
router.post('/api/accounts', accounts.create);

module.exports = router;
