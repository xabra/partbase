#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('partbase:server');
var http = require('http');
// var https = require('https');
// var fs = require('fs');  // Needed for reading in SSL keys & cert

/**
 * Read in HTTPS keys
 */

//var privateKey  = fs.readFileSync('./sslkeys/localhost.key', 'utf8');
//var certificate = fs.readFileSync('./sslkeys/localhost.cert', 'utf8');
//var credentials = {key: privateKey, cert: certificate};

/**
 * Get port from environment and store in Express.
 */

var httpPort = parseInt(process.env.PORT, 10) || 3000;
console.log("process.env.PORT: " + process.env.PORT);
console.log("httpPort: " + httpPort)
//var httpsPort = 8443;  //???

app.set('httpPort', httpPort);
//app.set('httpsPort', httpsPort);

/**
 * Create HTTP server.
 */

var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

/**
 * Listen on provided port, on all network interfaces.
 */

httpServer.listen(httpPort);
httpServer.on('error', onError);
httpServer.on('listening', onHTTPListening);

/**
 * Start HTTPS Server
 */
/*
httpsServer.listen(httpsPort);
httpsServer.on('error', onError);
httpsServer.on('listening', onHTTPSListening);
*/


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
   if (error.syscall !== 'listen') {
      throw error;
   }

   // handle specific listen errors with friendly messages
   switch (error.code) {
      case 'EACCES':
         console.error('Port ' + httpPort + ' requires elevated privileges');
         process.exit(1);
         break;
      case 'EADDRINUSE':
         console.error('Port ' + httpPort + ' is already in use');
         process.exit(1);
         break;
      default:
         throw error;
   };
};

/**
 * Event listener for HTTP server "listening" event.
 */

function onHTTPListening() {
   console.log('HTTP Listening on port ' + httpServer.address().port);
   debug('HTTP Listening on port ' + httpServer.address().port);
}

/**
 * Event listener for HTTPS server "listening" event.
 */
/*
function onHTTPSListening() {
  console.log('HTTPS Listening on port ' + httpsServer.address().port);
  debug('HTTPS Listening on port ' + httpsServer.address().port);
}
*/
