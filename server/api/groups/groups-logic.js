'use strict';


exports.mapping = function(item)
{
   var result = {};
   result.href = "http://localhost:3000/api/groups/" + item._id;      // TODO: Pass in URI prefix somehow
   result.name = item.name;
   result.description = item.description;
   result.status = item.status;

   return result;
}
