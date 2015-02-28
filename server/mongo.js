'use strict';

// --- mongo.js ---
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Logger = require('mongodb').Logger;

/**
*  === Initialize Mongo DB connection ===
*/

module.exports.init = function(app, options) {
   settings(app, options);    // Initialize settings with parameters and defaults

   // Form URL of Mongo DB 'partbase'
   var mongoUrl = 'mongodb://' + app.get('pbMongoHost')  + ':' + app.get('pbMongoPort') + '/' + app.get('pbMongoDBName');

   MongoClient.connect(mongoUrl, function(err, db) {
      if (err) {
         throw new Error('Could not connectto database: ' + err);
      }
      //Logger.setLevel('debug');
      app.set('pbMongoDB', db);
      console.log('Connected to Mongo DB at: ' + mongoUrl);
   });
};


function settings(app, options) {
   app.set('pbMongoHost', options.mongoHost); // Mongo DB Host name
   app.set('pbMongoPort', options.mongoPort); // Mongo DB port to use
   app.set('pbMongoDBName', options.mongoDBName); // Name of the mongo DB

}
