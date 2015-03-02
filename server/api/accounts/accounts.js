'use strict';

// TODO: Better error checking

var encrypt = require('../../utilities/encryption');
var Account = require('mongoose').model('Account');

exports.getAccounts = function(request, response) {
   Account.find({}, function(err, collection) {
      response.send(collection);
   });
};

exports.getAccount = function(request, response) {
   var id = request.params.accountId;
   Account.findById(id, function(err, account) {
      response.send(account);
   });
}
exports.deleteAccount = function(request, response) {
   var id = request.params.accountId;
   Account.findByIdAndRemove(id, function(err, account) {
      response.status(204).send();
   });
}

exports.updateAccount = function(request, response) {
   var id = request.params.accountId;
   Account.findById(id, function(err, account) {
      if (err) {     // If error finding account...
         return response.status(400).send({reason: err.toString()});    // respond with error
      }

      // Otherwise found a matching account...
      var updates = request.body;

      // TODO: This is kludgey...need a function to only update fileds that have been passed in
      if(updates.givenName) {
         account.givenName = updates.givenName;
      }

      if(updates.surname) {
         account.surname = updates.surname;
      }

      if(updates.username) {
         account.username = updates.username;
      }

      if(updates.email) {
         account.email = updates.email.toLowerCase(); // Force email to lower case
      }

      account.username = account.email; // Override username: Force username to be email address

      if(updates.password) {
         account.salt = encrypt.createSalt();     // Create a new salt
         account.hashed_pwd = encrypt.hashPwd(account.salt, accountData.password);   // Hash the new password with the new salt
      }

      if(updates.status) {
         account.status = updates.status;
      }

      account.save(function(err){
         response.status(202).send(account); // Return the modified account
      });
   });
}



exports.createAccount = function(request, response, next) {
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
