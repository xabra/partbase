'use strict';

// TODO: Better error checking

var helpers = require('./helpers');


exports.getList = function(resource, mapping) {

   return function(request, response) {
      resource.find({}, function(err, collection) {
         response.send(collection.map(mapping));
      });
   };
};

exports.getById = function(resource, mapping) {
   return function(request, response) {
      var id = request.params.itemId;
      resource.findById(id, function(err, item) {
         response.send(mapping(item));
      });
   };
};


exports.deleteById = function(resource) {
   return function(request, response) {
      var id = request.params.itemId;
      resource.findByIdAndRemove(id, function(err, item) {
         response.status(204).send();
      });
   };
};

exports.updateById = function(resource, mapping) {
   return function(request, response) {
      var id = request.params.itemId;
      resource.findById(id, function(err, item) {
         if (err) { // If error finding tenant...
            return response.status(400).send({
               reason: err.toString()
            }); // respond with error
         }

         // Otherwise, found a matching tenant...
         var updates = request.body;

         // Overwrite values of all tenant keys that are in the updates object
         item = helpers.updateObjectValues(updates, item);

         item.save(function(err) { // Save the updated tenant to the DB
            if (err) {;
            } // TODO: Do some error checking here !
            response.status(202).send(mapping(item)); // Otherwise no err, return the updated tenant
         });
      });
   };
};

exports.create = function(resource, mapping) {
   return function(request, response) {
      var data = request.body;
      resource.create(data, function(err, item) {
         if (err) { // If error...
            if (err.toString().indexOf('E11000') > -1) { // If Mongo error E11000 meaning non-uniqueness...
               err = new Error('Duplicate Tenant');
            }
            return response.status(409).send({
               reason: err.toString()
            }); // Otherwise some other error
         }
         response.status(201).send(mapping(item)); // Otherwise success, send back tenant
      })
   };
};
