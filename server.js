var express = require('express');
var http = require('http');

var app = express();

var httpServer = http.createServer(app);

// Switch to define whether we use 'development' or 'production' enviroment
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Set the config variables based on the env switch
var config = require('./server/config/config')[env];

// Configure  Mongo DB connection ===
var mongo = require('./server/config/mongo');
mongo.init(app, config);

// Configure  Mongoose DB connection ===
var mongoose = require('./server/config/mongoose');
mongoose(config);

// Configure the Express app
require('./server/config/express')(app, config);

// Configure auth and Stormpath
var auth = require('./server/config/auth');
auth.init(app, {
   secretKey: 'dzkjflkhIYGUYTDCLKJH9238jdlksd92n',
   enableHTTPS: false,
   sessionDuration: 20*60*60*1000,
   stormpathApiKeyFile: process.env.HOME + '/dev/keys/stormpath-apikey.properties',
   stormpathApplicationURL: 'https://api.stormpath.com/v1/applications/7dPCdUUTIwYZTDY81jXitE',
});

//Configure the server routes
app.use('/', require('./server/config/routes'));

httpServer.listen(config.port);

httpServer.on('listening', function () {
    console.log('Express HTTP server listening on port ' + httpServer.address().port + '...');
 });

// FOR LATER
//require('./server/config/mongoose')(config);

//require('./server/config/passport')();


//--------------------
// /**
//  * Event listener for HTTP server "error" event.
//  */
//
// function onError(error) {
//    if (error.syscall !== 'listen') {
//       throw error;
//    }
//
//    // handle specific listen errors with friendly messages
//    switch (error.code) {
//       case 'EACCES':
//          console.error('Port ' + httpPort + ' requires elevated privileges');
//          process.exit(1);
//          break;
//       case 'EADDRINUSE':
//          console.error('Port ' + httpPort + ' is already in use');
//          process.exit(1);
//          break;
//       default:
//          throw error;
//    };
// };
//
//
