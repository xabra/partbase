
'use strict';

var express = require('express');


module.exports.loginRequired = function(request, response, next) {
   if (!request.session.user) { // If NOT logged in....
      // Handle  failure to be logged in
      //response.userMessage = "You must be logged in to access this page";
      console.log("++++  " + "You must be logged in to access this page");
      //response.redirect(301, '/login');
      response.status(401).send();
   } else { // logged in...
      next();
   }
};

// TODO:  add a groupsRequired middleware here
