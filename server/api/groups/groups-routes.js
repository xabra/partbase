'use strict';

var express = require('express');
var router = express.Router();
var groups = require('./groups-controller');

router.get('/api/groups/count', groups.count());                 // Get a list of groups
router.get('/api/groups', groups.getList());                 // Get a list of groups
router.get('/api/groups/:itemId', groups.getById());         // Get group given its Id
router.delete('/api/groups/:itemId', groups.deleteById());  // Delete group given its Id
router.put('/api/groups/:itemId', groups.updateById());    // Update group given its Id
router.post('/api/groups', groups.create());              // Create a new group

module.exports = router;
