'use strict';

// TODO: Better error checking
// TODO: replace mapping with 2-way function, maybe middleware
// TODO: Implement HATEOAS URL links

var async = require('async');
var helpers = require('../../utilities/helpers');
var memberships = require('../memberships/memberships-controller');
var accounts = require('../accounts/accounts-controller');

var resource = require('mongoose').model('Group');
var Accounts = require('mongoose').model('Account');
var Memberships = require('mongoose').model('Membership');



exports.count = function() {
   return function(request, response) {
      resource.count({}, function(err, count) {
         response.send({
            count: count
         });
      });
   };
};

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
         console.log("updateById: ERR= " + err + ", Found Item with ID.  Item= " + JSON.stringify(item))
         if (err) { // If error finding item...
            return response.status(400).send({
               reason: err.toString()
            }); // respond with error
         }

         // Otherwise, found a matching item...
         var updates = request.body;
         console.log("updateById: UPDATES=" + JSON.stringify(updates))

         // Overwrite values of all item keys that are in the updates object
         item = helpers.updateObjectValues(updates, item);
         console.log("updateById: NEW RECORD=" + JSON.stringify(item))

         item.save(function(err) { // Save the updated item to the DB
            if (err) {;
               console.log("updateById: ERROR ON ITEM SAVE=" + err.toString());
            } // TODO: Do some error checking here !
            console.log("updateById: Got to item save")
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

exports.getGroupMembershipsList = function(request, response) {
   var id = request.params.itemId;     // Get the account id from the request path

   Memberships.find({groupId: id}, function(err, collection) {    // Query the Memberships for all entries with that account id
      response.send(collection.map(memberships.mapping));
   });
};

exports.getGroupAccountsList = function(request, response) {
   var id = request.params.itemId;     // Get the account id from the request path
   var accountsList = [];

   Memberships.find({groupId: id}, function(err, collection) {    // Query the Memberships for all entries with that account id
      if(err) return handleError(err);

      var iterator = function(membership, cb) {
         Accounts.findById(membership.accountId, function(err, account) {
            if(err) {
               cb(err);
            } else {
               console.log("Found Account" + JSON.stringify(account));
               accountsList.push(account);
               cb(); // Call cb with null = no error
            }
         })
      };

      var completion = function(err) {
         if(err) return handleError(err);
         console.log("Collection:" + JSON.stringify(accountsList));
         response.send(accountsList.map(accounts.mapping));
      };

      async.each(collection, iterator, completion);
   });
};

exports.deleteGroupAccount = function(request, response) {
   var groupId = request.params.itemId;     // Get the account id from the request path
   var accountId = request.params.accountId;     // Get the account id from the request path

   Memberships.remove ({groupId: groupId, accountId: accountId}, function(err) {    // Query the Memberships for all entries with that account id
      if(err) return handleError(err);
      response.status(204).send();
   });
};



var mapping = function(item) {
   var result = {};
   result._id = item._id;
   result.href = "TBI"; //request.protocol+"://"+request.hostname+request.path + item._id; // TODO: Pass in URI prefix somehow
   result.name = item.name;
   result.description = item.description;
   result.status = item.status;

   return result;
}

exports.mapping = mapping;
