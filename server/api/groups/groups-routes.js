'use strict';

var express = require('express');
var router = express.Router();
var groups = require('./groups-logic');


router.get('/api/groups', groups.getList);                 // Get a list of groups
router.get('/api/groups/:groupId', groups.getById);         // Get group given its Id
router.delete('/api/groups/:groupId', groups.deleteById);  // Delete group given its Id
router.post('/api/groups/:groupId', groups.updateById);    // Update group given its Id
router.post('/api/groups', groups.create);              // Create a new group
// CREATE should be in the path of the object that OWNS the groups, but that doesn't exist yet...

module.exports = router;
