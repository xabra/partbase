'use strict';

// TODO: Better error checking

var Document = require('mongoose').model('Document');
var helpers = require('../../utilities/helpers');

var dbToAPI = function(db)
{
   var result = {};
   result.href = "http://localhost:3000/api/documents/" + db._id;      // TODO: Pass in URI prefix somehow
   result.title = db.title;
   result.description = db.description;
   result.docType = db.docType;
   result.partType = db.partType;
   result.project = db.project;
   result.author = db.author;
   result.createdDate = db.createdDate;
   result.revision = db.revision;
   result.documentNum = db.documentNum;

   return result;
}
exports.getList = function(request, response) {
   Document.find({}, function(err, collection) {
      response.send(collection.map(dbToAPI));
   });
};

exports.getById = function(request, response) {
   var id = request.params.documentId;
   Document.findById(id, function(err, document) {
      response.send(dbToAPI(document));
   });
}
exports.deleteById = function(request, response) {
   var id = request.params.documentId;
   Document.findByIdAndRemove(id, function(err, document) {
      response.status(204).send();
   });
}

exports.updateById = function(request, response) {
   var id = request.params.documentId;
   Document.findById(id, function(err, document) {
      if (err) {     // If error finding document...
         return response.status(400).send({reason: err.toString()});    // respond with error
      }

      // Otherwise, found a matching document...
      var updates = request.body;

      // Overwrite values of all document keys that are in the updates object
      document = helpers.updateObjectValues(updates, document);

      document.save(function(err){      // Save the updated document to the DB
         if (err) {;} // TODO: Do some error checking here !
         response.status(202).send(dbToAPI(document)); // Otherwise no err, return the updated document
      });
   });
}

exports.create = function(request, response, next) {
   var data = request.body;

   Document.create(data, function(err, document) {
      if (err) {     // If error...
         if (err.toString().indexOf('E11000') > -1) {    // If Mongo error E11000 meaning non-uniqueness...
            err = new Error('Duplicate Document');
         }
         return response.status(400).send({reason: err.toString()});    // Otherwise some other error
      }
      response.status(201).send(dbToAPI(document)); // Otherwise success, send back document
   })
};


//====================   SNIPPET - NOT DOING ANYTHING ....
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
