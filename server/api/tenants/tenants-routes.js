'use strict';

var express = require('express');
var router = express.Router();
var Tenant = require('mongoose').model('Tenant');
var tenants = require('./tenants-logic');
var routeHandler = require('../../utilities/route-handler');

router.get('/api/tenants', routeHandler.getList(Tenant, tenants.mapping)); // Get a list of tenants
router.get('/api/tenants/:itemId', routeHandler.getById(Tenant, tenants.mapping)); // Get tenant given its Id
router.delete('/api/tenants/:itemId', routeHandler.deleteById(Tenant)); // Delete tenant given its Id
router.post('/api/tenants/:itemId', routeHandler.updateById(Tenant, tenants.mapping)); // Update tenant given its Id
router.post('/api/tenants', routeHandler.create(Tenant, tenants.mapping)); // Create a new tenant
// CREATE should be in the path of the object that OWNS the tenants, but that doesn't exist yet...

module.exports = router;
