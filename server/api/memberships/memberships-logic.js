'use strict';

// TODO: Better error checking

var encrypt = require('../../utilities/encryption');
var Membership = require('mongoose').model('Membership');
var helpers = require('../../utilities/helpers');

exports.getList = function(request, response) {
   Membership.find({}, function(err, collection) {
      response.send(collection);
   });
};

exports.getById = function(request, response) {
   var id = request.params.membershipId;
   Membership.findById(id, function(err, membership) {
      response.send(membership);
   });
}
exports.deleteById = function(request, response) {
   var id = request.params.membershipId;
   Membership.findByIdAndRemove(id, function(err, membership) {
      response.status(204).send();
   });
}

exports.updateById = function(request, response) {
   var id = request.params.membershipId;
   Membership.findById(id, function(err, membership) {
      if (err) {     // If error finding membership...
         return response.status(400).send({reason: err.toString()});    // respond with error
      }

      // Otherwise, found a matching membership...
      var updates = request.body;

      // Overwrite values of all membership keys that are in the updates object
      membership = helpers.updateObjectValues(updates, membership);

      membership.save(function(err){      // Save the updated membership to the DB
         if (err) {;} // TODO: Do some error checking here !
         response.status(202).send(membership); // Otherwise no err, return the updated membership
      });
   });
}

exports.create = function(request, response, next) {
   var data = request.body;

   Membership.create(data, function(err, membership) {
      if (err) {     // If error...
         if (err.toString().indexOf('E11000') > -1) {    // If Mongo error E11000 meaning non-uniqueness...
            err = new Error('Duplicate Membership');
         }
         return response.status(400).send({reason: err.toString()});    // Otherwise some other error
      }
      response.status(201).send(membership); // Otherwise success, send back membership
   })
};
