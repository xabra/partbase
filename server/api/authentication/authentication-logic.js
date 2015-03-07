'use strict';

// TODO: Better error checking

exports.authenticateAccount = function(request, response) {
   ;  // TODO: do something here
   response.status(200).send({}); // Send response with account that was inserted into DB
};

exports.registerNewAccount = function(request, response) {
   ;  // TODO: do something here
   response.status(200).send({}); // Send response with account that was inserted into DB
}

exports.logout = function(request, response) {
   request.session.destroy();		// Delete the cookie with the accounts info.  TODO: Check if session exists first
   console.log("account logged out from server");
   response.status(200).send({}); // Send response with account that was inserted into DB
}
