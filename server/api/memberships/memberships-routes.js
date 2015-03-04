'use strict';

var express = require('express');
var router = express.Router();
var memberships = require('./memberships-logic');


router.get('/api/memberships', memberships.getList);                 // Get a list of memberships
router.get('/api/memberships/:membershipId', memberships.getById);         // Get membership given its Id
router.delete('/api/memberships/:membershipId', memberships.deleteById);  // Delete membership given its Id
router.post('/api/memberships/:membershipId', memberships.updateById);    // Update membership given its Id
router.post('/api/memberships', memberships.create);              // Create a new membership
// CREATE should be in the path of the object that OWNS the memberships, but that doesn't exist yet...

module.exports = router;
