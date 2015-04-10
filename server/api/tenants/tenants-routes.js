'use strict';

var express = require('express');
var router = express.Router();

var tenants = require('./tenants-controller');

router.get('/api/tenants/count', tenants.count()); // Get count
router.get('/api/tenants', tenants.getList()); // Get a list of tenants
router.get('/api/tenants/:itemId', tenants.getById()); // Get tenant given its Id
router.delete('/api/tenants/:itemId', tenants.deleteById()); // Delete tenant given its Id
router.post('/api/tenants/:itemId', tenants.updateById()); // Update tenant given its Id
router.post('/api/tenants', tenants.create()); // Create a new tenant

module.exports = router;
