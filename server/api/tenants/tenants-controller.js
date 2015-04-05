'use strict';

var helpers = require('../../utilities/helpers');
var resource = require('mongoose').model('Tenant');

exports.getList = function() {

   return function(request, response) {
      resource.find({}, function(err, collection) {
         response.send(collection.map(mapping));
      });
   };
};

exports.getById = function() {
   return function(request, response) {
      var id = request.params.itemId;
      resource.findById(id, function(err, item) {
         response.send(mapping(item));
      });
   };
};


exports.deleteById = function() {
   return function(request, response) {
      var id = request.params.itemId;
      resource.findByIdAndRemove(id, function(err, item) {
         response.status(204).send();
      });
   };
};

exports.updateById = function() {
   return function(request, response) {
      var id = request.params.itemId;
      resource.findById(id, function(err, item) {
         if (err) { // If error finding item...
            return response.status(400).send({
               reason: err.toString()
            }); // respond with error
         }

         // Otherwise, found a matching item...
         var updates = request.body;

         // Overwrite values of all item keys that are in the updates object
         item = helpers.updateObjectValues(updates, item);

         item.save(function(err) { // Save the updated item to the DB
            if (err) {;
            } // TODO: Do some error checking here !
            response.status(202).send(mapping(item)); // Otherwise no err, return the updated item
         });
      });
   };
};

exports.create = function() {
   return function(request, response) {
      var data = request.body;
      resource.create(data, function(err, item) {
         if (err) { // If error...
            if (err.toString().indexOf('E11000') > -1) { // If Mongo error E11000 meaning non-uniqueness...
               err = new Error('Duplicate Group');
            }
            return response.status(409).send({
               reason: err.toString()
            }); // Otherwise some other error
         }
         response.status(201).send(mapping(item)); // Otherwise success, send back item
      })
   };
};


var mapping = function(item)
{
   var result = {};
   result.href = "http://localhost:3000/api/tenants/" + item._id;      // TODO: Pass in URI prefix somehow
   result.name = item.name;
   result.key = item.key;

   return result;
}
