var mongoose = require('mongoose');

// For populating dummy data-- Get rid of these later
var accountsModel = require('../api/accounts/accounts-model');
var groupsModel = require('../api/groups/groups-model');
var tenantsModel = require('../api/tenants/tenants-model');
var documentsModel = require('../api/documents/documents-model');

module.exports = function(config) {
   mongoose.connect(config.db);
   var db = mongoose.connection;
   db.on('error', console.error.bind(console, 'connection error...'));
   db.once('open', function callback() {
      console.log('PartBase connected to Mongo DB via Mongoose at ' + config.db);
   });


   // For populating dummy data-- Get rid of these later
   accountsModel.populateDBWithDummyData();
   groupsModel.populateDBWithDummyData();
   tenantsModel.populateDBWithDummyData();
   documentsModel.populateDBWithDummyData();
};
