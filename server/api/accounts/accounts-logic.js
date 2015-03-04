'use strict';

// TODO: Better error checking

var encrypt = require('../../utilities/encryption');
var Account = require('mongoose').model('Account');
var helpers = require('../../utilities/helpers');

exports.getList = function(request, response) {
   Account.find({}, function(err, collection) {
      response.send(collection);
   });
};

exports.getById = function(request, response) {
   var id = request.params.accountId;
   Account.findById(id, function(err, account) {
      response.send(account);
   });
}
exports.deleteById = function(request, response) {
   var id = request.params.accountId;
   Account.findByIdAndRemove(id, function(err, account) {
      response.status(204).send();
   });
}

exports.updateById = function(request, response) {
   var id = request.params.accountId;
   Account.findById(id, function(err, account) {
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

      account.username = account.email; // Override username: Force username to be email address

      if(updates.password) {     // If the password is being updated...
         account.salt = encrypt.createSalt();     // Create a new salt
         account.hashed_pwd = encrypt.hashPwd(account.salt, updates.password);   // Hash the new password with the new salt
      }

      account.save(function(err){      // Save the updated account to the DB
         if (err) {;} // TODO: Do some error checking here !
         response.status(202).send(account); // Otherwise no err, return the updated account
      });
   });
}



exports.create = function(request, response, next) {
   var accountData = request.body;
   accountData.email = accountData.email.toLowerCase(); // Lowercase it to prevent differences in case from becoming unique accounts
   accountData.username = accountData.username;    // Case sensitive username (not used here)
   accountData.username = accountData.email;    // Make the username be the email address
   // Could validate email address so it has the form of a real email address

   accountData.salt = encrypt.createSalt();     // Create the salt
   accountData.hashed_pwd = encrypt.hashPwd(accountData.salt, accountData.password);   // Hash the password with te salt

   Account.create(accountData, function(err, account) {
      if (err) {     // If error...
         if (err.toString().indexOf('E11000') > -1) {    // If Mongo error E11000 meaning non-uniqueness...
            err = new Error('Duplicate Username');
         }
         return response.status(400).send({reason: err.toString()});    // Otherwise some other error
      }
      response.status(201).send(account); // Otherwise success, send back account
   })
};
