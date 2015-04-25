'use strict';

var express = require('express');
var router = express.Router();
var memberships = require('./memberships-controller');

router.get('/api/memberships/count', memberships.count());           // Get a count of memberships
router.get('/api/memberships', memberships.getList());               // Get a list of memberships
router.get('/api/memberships/:itemId', memberships.getById());       // Get membership given its Id
router.delete('/api/memberships/:itemId', memberships.deleteById()); // Delete membership given its Id
router.put('/api/memberships/:itemId', memberships.updateById());    // Update membership given its Id
router.post('/api/memberships', memberships.create());               // Create a new membership

module.exports = router;
