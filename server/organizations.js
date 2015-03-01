// ===== organizations.js =====

var express = require('express');
var router = express.Router();
var mongo = require('./config/mongo');
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var auth = require('./config/auth');

// ======== ORGANIZATIONS =======
// --- GET /organizations/docnum/format ---
router.get('/organizations/list', auth.loginRequired, function(request, response) {
	var collection = request.app.get('pbMongoDB').collection('organizations');

	collection.find().toArray(function(err, results) {  // Locate all the entries using find, stuff into an array
		if (err) console.log("ORGANIZATIONS List - err from Mongo");
		assert.equal(err, null);
		console.log('>>> SERVER did GET/documents');
		response.status(200).send(results);
	});
});

// --- POST /users/register  ---
router.post('/organizations/create', auth.loginRequired, function (request, response) {
	var collection = request.app.get('pbMongoDB').collection('organizations');
	request.body.createdDate = new Date();		// Put current date/time into db.

	collection.insertOne(request.body, {w:1}, function(err, result) {
		assert.equal(err, null);
		assert.equal(1, result.insertedCount);
		console.log('>>> SERVER did POST/organizations/create');

		response.status(200).send(result.ops[0]); // Send response with user that was inserted into DB
	});
});

module.exports = router;
