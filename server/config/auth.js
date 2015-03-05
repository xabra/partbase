'use strict';

var express = require('express');
var crypto = require('crypto');

/**
 * === Set up Stormpath client ===
 */
 module.exports.init = function(app, options) {
    var router = express.Router();

    settings(app, options); // Save the input settings and set defaults to the express app

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
