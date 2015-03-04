'use strict';

// TODO: Better error checking

var encrypt = require('../../utilities/encryption');
var Group = require('mongoose').model('Group');
var helpers = require('../../utilities/helpers');

exports.getList = function(request, response) {
   Group.find({}, function(err, collection) {
      response.send(collection);
   });
};

exports.getById = function(request, response) {
   var id = request.params.groupId;
   Group.findById(id, function(err, group) {
      response.send(group);
   });
}
exports.deleteById = function(request, response) {
   var id = request.params.groupId;
   Group.findByIdAndRemove(id, function(err, group) {
      response.status(204).send();
   });
}

exports.updateById = function(request, response) {
   var id = request.params.groupId;
   Group.findById(id, function(err, group) {
      if (err) {     // If error finding group...
         return response.status(400).send({reason: err.toString()});    // respond with error
      }

      // Otherwise, found a matching group...
      var updates = request.body;

      // Overwrite values of all group keys that are in the updates object
      group = helpers.updateObjectValues(updates, group);

      group.save(function(err){      // Save the updated group to the DB
         if (err) {;} // TODO: Do some error checking here !
         response.status(202).send(group); // Otherwise no err, return the updated group
      });
   });
}

exports.create = function(request, response, next) {
   var data = request.body;

   Group.create(data, function(err, group) {
      if (err) {     // If error...
         if (err.toString().indexOf('E11000') > -1) {    // If Mongo error E11000 meaning non-uniqueness...
            err = new Error('Duplicate Group');
         }
         return response.status(400).send({reason: err.toString()});    // Otherwise some other error
      }
      response.status(201).send(group); // Otherwise success, send back group
   })
};
