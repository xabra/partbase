// ===== documents.js =====

var express = require('express');
var router = express.Router();
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var mongo = require('./config/mongo');
var auth = require('./config/auth');


// ======== DOCUMENTS =======
// --- GET /documents ---
router.get('/documents/list', auth.loginRequired, function(request, response) {
	var collection = request.app.get('pbMongoDB').collection('documents');
	collection.find().toArray(function(err, results) {  // Locate all the entries using find, stuff into an array
		assert.equal(err, null);
	 	console.log('>>> SERVER did GET/documents');
		response.status(200).send(results);
	});
});

// --- POST /create ---
router.post('/documents/create', auth.loginRequired, function (request, response) {
	var db = request.app.get('pbMongoDB');
	var collection = db.collection('documents');

	request.body.createdDate = new Date();		// Put current date/time into db.
	request.body.revision = 0;	// Set initial revision
	getNextSequence(db, 'documentNumbers', function(nextNum){
		request.body.documentNum = nextNum.toString(); //getNextSequence('documentNumbers').toString();		// New doc num

		collection.insertOne(request.body, {w:1}, function(err, result) {
			assert.equal(err, null);
			assert.equal(1, result.insertedCount);
			console.log('>>> SERVER did POST/create  NEW ID:'+ result.ops[0]._id);

			response.status(200).send(result.ops[0]); // Send response with new document that was inserted into DB

		});
	});
});

// --- POST /update ---
router.post('/documents/update', auth.loginRequired, function(request, response) {
	var collection = request.app.get('pbMongoDB').collection('documents');

	var id = new objectId(request.body._id);
	request.body._id = id;	//Convert string id into Object for updating to db.
	collection.updateOne({ _id : id }, request.body, {w:1}, function(err, result) {
		assert.equal(err, null);
		assert.equal(1, result.matchedCount);
		assert.equal(1, result.modifiedCount);
	 	console.log('>>> SERVER did POST/update for doc id: '+ request.body._id);
		response.status(200).send({'success' : 1});
	});
});

// --- POST /delete ---
router.post('/documents/delete', auth.loginRequired, function(request, response) {
	var collection = request.app.get('pbMongoDB').collection('documents');

	var id = new objectId(request.body._id);
	collection.deleteOne({ _id : id }, {w:1}, function(err, result) {
		assert.equal(err, null);
		assert.equal(1, result.deletedCount);
	 	console.log('>>> SERVER did POST/delete for doc id:'+ request.body._id);
		response.status(200).send({'success' : 1});
	});
});

function getNextSequence(db, name, callback) {
	var nextSeq = null;
	var collection = db.collection('counters');
  	collection.findAndModify( { _id: name }, [['_id',1]], { $inc: { seq: 1 } }, {new: true}, function(err, ret){
  		assert.equal(null, err);
  		nextSeq = ret.value.seq;
		//console.log('>>> SERVER next seq = : '+ nextSeq);
		callback(nextSeq);
  	});

}


module.exports = router;
