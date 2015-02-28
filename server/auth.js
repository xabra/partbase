'use strict';

var express = require('express');
var stormpath = require('stormpath');

/**
 * === Set up Stormpath client ===
 */
 module.exports.init = function(app, options) {
    var router = express.Router();

    settings(app, options); // Save the input settings and set defaults to the express app
    initStormPath(app);     // Initialize Stormpath

    //Set up client-sessions middleware
    var session = require('client-sessions');
    router.use(session({
      cookieName: 'session',
      requestKey: 'session',
      secret: app.get('authSecretKey'),
      duration: app.get('authSessionDuration'),
      activeDuration: app.get('authSessionActiveDuration'),
      cookie: {
         httpOnly: true,
         secure: app.get('authEnableHTTPS'),
      }
   }));

   app.use('/', router);
};


function settings(app, options) {
   app.set('authSecretKey', options.secretKey); // Secret key for session token encryption
   app.set('authEnableHTTPS', options.enableHTTPS || false); //Default to false
   app.set('authSessionDuration', options.sessionDuration || 15 * 60 * 1000); // in ms
   app.set('authSessionActiveDuration', options.sessionActiveDuration || 15 * 60 * 1000);
   app.set('authStormpathApiKeyFile', options.stormpathApiKeyFile);
   app.set('authStormpathApplicationURL', options.stormpathApplicationURL);
}

function initStormPath(app) {
   stormpath.loadApiKey(app.get('authStormpathApiKeyFile'), function(err, apiKey) {    // Get the SP API Key from a file
      if (err)
         throw err; //Error loading API key
      var spClient = new stormpath.Client({ apiKey: apiKey }); // Create a new SP Client with the API Key
      app.set('authStormpathClient', spClient);    //Store a reference to the SP client in the express app


      spClient.getApplication(app.get('authStormpathApplicationURL'), function(err, spApp) { // Get the SP application from the URL
         if (err) throw err;
         app.set('authStormpathApplication', spApp);    //Store a reference to the SP application in the express app
      });
   });
}


module.exports.loginRequired = function(request, response, next) {
   if (!request.session.user) {     // If NOT logged in....
      // Handle  failure to be logged in
      //response.userMessage = "You must be logged in to access this page";
      console.log("++++  " + "You must be logged in to access this page");
      //response.redirect(301, '/login');
      response.status(401).send();
   } else {    // logged in...
      next();
   }
};

// TODO:  add a groupsRequired middleware here
