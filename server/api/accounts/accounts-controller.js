'use strict';

// TODO: Better error checking
// TODO: replace mapping with 2-way function, maybe middleware
// TODO: Implement HATEOAS URL links

var encrypt = require('../../utilities/encryption');
var helpers = require('../../utilities/helpers');

var resource = require('mongoose').model('Account');

exports.count = function() {
   return function(request, response) {
      resource.count({}, function(err, count) {
         response.send({count: count});
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


exports.updateById = function(request, response) {
   var id = request.params.itemId;
   resource.findById(id, function(err, account) {
      if (err) {     // If error finding account...
         return response.status(400).send({reason: err.toString()});    // respond with error
      }

      // Otherwise, found a matching account...
      var updates = request.body;

      if(updates.email) {     // If the email address will be updated...
         updates.email = updates.email.toLowerCase(); // Force the new email to lower case before updating account
      }

      // Overwrite values of all account keys that are in the updates object
      // (Since the account does not contain a password key, the plaintext password should never get written to account object)
      account = helpers.updateObjectValues(updates, account);

      account.accountname = account.email; // Override accountname: Force accountname to be email address

      if(updates.password) {     // If the password is being updated...
         account.salt = encrypt.createSalt();     // Create a new salt
         account.hashed_pwd = encrypt.hashPwd(account.salt, updates.password);   // Hash the new password with the new salt
      }

      account.save(function(err){      // Save the updated account to the DB
         if (err) {;} // TODO: Do some error checking here !
         response.status(202).send(mapping(account)); // Otherwise no err, return the updated account
      });
   });
}



exports.register = function(request, response) {
   var accountData = {};

   accountData.givenName = request.body.givenName;
   accountData.surname = request.body.surname;
   accountData.accountName = request.body.email.toLowerCase();    // Make the accountname be the email address
   accountData.email = request.body.email.toLowerCase(); // Lowercase it to prevent differences in case from becoming unique accounts
   accountData.status = 'ENABLED';

   accountData.salt = encrypt.createSalt();     // Create the salt
   accountData.hashed_pwd = encrypt.hashPwd(accountData.salt, request.body.password);   // Hash the password with te salt


   console.log("Attempting to create new account with:" + JSON.stringify(accountData));
   resource.create(accountData, function(err, account) {
      if (err) {     // If error...
         if (err.toString().indexOf('E11000') > -1) {    // If Mongo error E11000 meaning non-uniqueness...
            err = new Error('Duplicate accountname');
         }
         return response.status(407).send({reason: err.toString()});    // Otherwise some other error
      }
      response.status(201).send(mapping(account)); // Otherwise success, send back account
   })
};

exports.authenticate = function(request, response) {
   ;  // TODO: do something here
   response.status(200).send({}); // Send response with account that was inserted into DB
};

exports.logout = function(request, response) {
   request.session.destroy();		// Delete the cookie with the accounts info.  TODO: Check if session exists first
   console.log("account logged out from server");
   response.status(200).send({}); // Send response with account that was inserted into DB
}


var mapping = function(item)
{
   var result = {};
   result._id = item._id;
   result.href = "http://localhost:3000/api/accounts/" + item._id;      // TODO: Pass in URI prefix somehow
   result.accountname = item.accountname;
   result.email = item.email;
   result.givenName = item.givenName;
   result.surname = item.surname;
   result.status = item.status;
   result.emailVerificationToken = item.emailVerificationToken;

   return result;
}
