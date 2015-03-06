'use strict';

// TODO: Better error checking

var encrypt = require('../../utilities/encryption');
var Tenant = require('mongoose').model('Tenant');
var helpers = require('../../utilities/helpers');

var dbToAPI = function(db)
{
   var result = {};
   result.href = "http://localhost:3000/api/tenants/" + db._id;      // TODO: Pass in URI prefix somehow
   result.name = db.name;
   result.key = db.key;

   return result;
}


exports.getList = function(request, response) {
   Tenant.find({}, function(err, collection) {
      response.send(collection.map(dbToAPI));
   });
};

exports.getById = function(request, response) {
   var id = request.params.tenantId;
   Tenant.findById(id, function(err, tenant) {
      response.send(dbToAPI(tenant));
   });
}
exports.deleteById = function(request, response) {
   var id = request.params.tenantId;
   Tenant.findByIdAndRemove(id, function(err, tenant) {
      response.status(204).send();
   });
}

exports.updateById = function(request, response) {
   var id = request.params.tenantId;
   Tenant.findById(id, function(err, tenant) {
      if (err) {     // If error finding tenant...
         return response.status(400).send({reason: err.toString()});    // respond with error
      }

      // Otherwise, found a matching tenant...
      var updates = request.body;

      // Overwrite values of all tenant keys that are in the updates object
      tenant = helpers.updateObjectValues(updates, tenant);

      tenant.save(function(err){      // Save the updated tenant to the DB
         if (err) {;} // TODO: Do some error checking here !
         response.status(202).send(dbToAPI(tenant)); // Otherwise no err, return the updated tenant
      });
   });
}

exports.create = function(request, response, next) {
   var data = request.body;

   Tenant.create(data, function(err, tenant) {
      if (err) {     // If error...
         if (err.toString().indexOf('E11000') > -1) {    // If Mongo error E11000 meaning non-uniqueness...
            err = new Error('Duplicate Tenant');
         }
         return response.status(400).send({reason: err.toString()});    // Otherwise some other error
      }
      response.status(201).send(dbToAPI(tenant)); // Otherwise success, send back tenant
   })
};
