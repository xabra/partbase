'use strict';

var express = require('express');
var router = express.Router();
var Membership = require('mongoose').model('Membership');
var memberships = require('./memberships-logic');
var routeHandler = require('../../utilities/route-handler');

router.get('/api/memberships', routeHandler.getList(Membership, memberships.mapping));          // Get a list of memberships
router.get('/api/memberships/:itemId', routeHandler.getById(Membership, memberships.mapping));  // Get membership given its Id
router.delete('/api/memberships/:itemId', routeHandler.deleteById(Membership));                 // Delete membership given its Id
router.post('/api/memberships/:itemId', routeHandler.updateById(Membership, memberships.mapping)); // Update membership given its Id
router.post('/api/memberships', routeHandler.create(Membership, memberships.mapping));          // Create a new membership

module.exports = router;
