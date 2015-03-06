'use strict';

var express = require('express');

module.exports = function(app, options) {
   var router = express.Router();
   var session = require('client-sessions');

   router.use(session({
      cookieName: 'session',
      requestKey: 'session',
      secret: options.sessionSecretKey,
      duration: options.sessionDuration,
      activeDuration: options.sessionActiveDuration,
      cookie: {
         httpOnly: true,
         secure: options.enableHTTPS,
      }
   }));

   app.use('/', router);
};
