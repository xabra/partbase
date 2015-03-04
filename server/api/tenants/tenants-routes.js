'use strict';

var express = require('express');
var router = express.Router();
var tenants = require('./tenants-logic');


router.get('/api/tenants', tenants.getList);                 // Get a list of tenants
router.get('/api/tenants/:tenantId', tenants.getById);         // Get tenant given its Id
router.delete('/api/tenants/:tenantId', tenants.deleteById);  // Delete tenant given its Id
router.post('/api/tenants/:tenantId', tenants.updateById);    // Update tenant given its Id
router.post('/api/tenants', tenants.create);              // Create a new tenant
// CREATE should be in the path of the object that OWNS the tenants, but that doesn't exist yet...

module.exports = router;
