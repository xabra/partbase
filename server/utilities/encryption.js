'use strict';

var crypto = require('crypto');

/*
*  --- Pasword hashing and salting utility functions
*/
exports.createSalt = function() {
  return crypto.randomBytes(128).toString('base64');
}

exports.hashPwd = function(salt, pwd) {
  var hmac = crypto.createHmac('sha1', salt);
  return hmac.update(pwd).digest('hex');
}
