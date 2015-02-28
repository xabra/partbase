'use strict';

// ===== users.js =====

var express = require('express');
var router = express.Router();
var mongo = require('./mongo');		// QUESTION: how do the calls to collection below 'see' the mongo methods when I didnt require 'mongo'?
var objectId = require('mongodb').ObjectID;
var assert = require('assert');		// Not being used right now...
var auth = require('./auth');

// --- GET /users/list ---
router.get('/users/list', auth.loginRequired, function(request, response) {
	var collection = request.app.get('pbMongoDB').collection('users');
	console.log('>>> SERVER is about to GET/users');
	collection.find().toArray(function(err, results) {  // Locate all the entries using find, stuff into an array
		assert.equal(err, null);
	 	console.log('>>> SERVER did GET/users');
		response.status(200).send(results);
	});
});

// --- POST /delete ---
router.post('/users/delete', auth.loginRequired, function(request, response) {
	var collection = request.app.get('pbMongoDB').collection('users');

	var id = new objectId(request.body._id);
	collection.deleteOne({ _id : id }, {w:1}, function(err, result) {
		assert.equal(err, null);
		assert.equal(1, result.deletedCount);
	 	console.log('>>> SERVER did POST/delete for user id:'+ request.body._id);
		response.status(200).send({'success' : 1});
	});
});

module.exports = router;
