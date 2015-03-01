'use strict';

// --- mongo.js ---
var MongoClient = require('mongodb').MongoClient;

/**
*  === Initialize Mongo DB connection ===
*/
module.exports.init = function(app, config) {

   MongoClient.connect(config.db, function(err, db) {
      if (err) {
         throw new Error('Could not connect to database: ' + err);
      }
      //Logger.setLevel('debug');
      app.set('pbMongoDB', db);     // TODO get rid of ths in favor of storing whole environment object
      console.log('Connected to Mongo DB at: ' + config.db);
   });
};
