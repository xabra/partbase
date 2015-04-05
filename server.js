var express = require('express');
var http = require('http');

var app = express();

var httpServer = http.createServer(app);

// Switch to define whether we use 'development' or 'production' enviroment
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Set the config parameters based on the env switch
var params = require('./server/config/config-params')[env];

// Configure  Mongoose DB connection ===
var mongooseConfig = require('./server/config/mongoose-config');
mongooseConfig(params);

// Configure the Express app
var expressConfig = require('./server/config/express-config');
expressConfig(app, params);

// Configure auth
var sessionConfig = require('./server/config/session-config');
sessionConfig(app, params);

//Configure the server routes
var allRoutes = require('./server/config/route-index');
app.use('/', allRoutes);

// Start the server listening
httpServer.listen(params.port);

// Report server has started
httpServer.on('listening', function () {
    console.log('Express HTTP server listening on port ' + httpServer.address().port + '...');
 });

 // Report server has started
 httpServer.on('error', function (error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
          console.error('Port ' + this.address().port + ' requires elevated privileges');
          process.exit(1);
          break;
      case 'EADDRINUSE':
          console.error('Port ' + this.address().port + ' is already in use');
          process.exit(1);
          break;
      default:
          throw error;
    };
});
