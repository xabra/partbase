var mongoose = require('mongoose');

// For populating dummy data-- Get rid of these later
var accountModel = require('../api/accounts/accountModel');


module.exports = function(config) {
   mongoose.connect(config.db);
   var db = mongoose.connection;
   db.on('error', console.error.bind(console, 'connection error...'));
   db.once('open', function callback() {
      console.log('PartBase connected to Mongo DB via Mongoose at ' + config.db);
   });


   // For populating dummy data-- Get rid of these later
   accountModel.createDefaultAccounts();

};
