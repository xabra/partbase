'use strict';

var express = require('express');
var router = express.Router();
var Group = require('mongoose').model('Group');
var groups = require('./groups-logic');
var routeHandler = require('../../utilities/route-handler');


router.get('/api/groups', routeHandler.getList(Group, groups.mapping));                 // Get a list of groups
router.get('/api/groups/:itemId', routeHandler.getById(Group, groups.mapping));         // Get group given its Id
router.delete('/api/groups/:itemId', routeHandler.deleteById(Group));  // Delete group given its Id
router.post('/api/groups/:itemId', routeHandler.updateById(Group, groups.mapping));    // Update group given its Id
router.post('/api/groups', routeHandler.create(Group, groups.mapping));              // Create a new group
// CREATE should be in the path of the object that OWNS the groups, but that doesn't exist yet...

module.exports = router;
 
