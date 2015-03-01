'use strict';

var express = require('express');
var router = express.Router();

var auth = require('./config/auth');

// ======== AUTHENTICATE =======
// --- Authenticate User (STORMPATH Wrapper)
router.post('/authenticate', function (request, response) {
   console.log('>>> Server received /authenticate request');
   // Get the stormpath application object and call its auth method
   request.app.get('authStormpathApplication').authenticateAccount(request.body, function onAuthcResult(err, result) {
      if(err) {	//Failed to authenticate...
         throw err;		// Handle this...
      } else {		// Authenticate succeeded...
         result.getAccount(function(err, account) { //Extract the account from the Auth result
            if(err) {
               throw err;		// Authenticated, but couldnt extract the account...???  Handle this...
            } else {
               request.session.user = account.href;		// set a cookie with the user's info
               console.log(">>> Authenticated account: " + JSON.stringify(account.href));
               response.status(200).send(account); // Send response with user that was inserted into DB
            }
         });
      }
   });
});

// --- Register user (STORMPATH Wrapper)
router.post('/register', function (request, response) {
   console.log('>>> Server received /register request: ' + JSON.stringify(request.body));

   request.app.get('authStormpathApplication').createAccount(request.body, function onAccountCreated(err, account) {
      if(err) {	// Failed to creage account...
         throw err;		// handle this...
      } else {		// Success...
         console.log(">>> Created new account: " + JSON.stringify(account.href));
         request.session.user = account.href;		// set a cookie with the user's info
         response.status(200).send(account); // Send response with user that was inserted into DB
      }
   });
});


// --- Logout user (STORMPATH Wrapper)
router.post('/logout', function (request, response) {
   request.session.destroy();		// Delete the cookie with the users info
   console.log(">>> Session destroyed.  User logged out from server");
   response.status(200).send({}); // Send response with user that was inserted into DB
});

module.exports = router;
