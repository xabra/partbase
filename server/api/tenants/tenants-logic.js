'use strict';

var Tenant = require('mongoose').model('Tenant');


exports.mapping = function(item)
{
   var result = {};
   result.href = "http://localhost:3000/api/tenants/" + item._id;      // TODO: Pass in URI prefix somehow
   result.name = item.name;
   result.key = item.key;

   return result;
}
