var mongoose = require('mongoose');

// For populating dummy data-- Get rid of these later
var accountModel = require('../api/accounts/account-model');
var groupModel = require('../api/groups/group-model');

module.exports = function(config) {
   mongoose.connect(config.db);
   var db = mongoose.connection;
   db.on('error', console.error.bind(console, 'connection error...'));
   db.once('open', function callback() {
      console.log('PartBase connected to Mongo DB via Mongoose at ' + config.db);
   });


   // For populating dummy data-- Get rid of these later
   accountModel.populateDBWithDummyData();
   groupModel.populateDBWithDummyData();
};
