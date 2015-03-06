'use strict';


exports.mapping = function(item)
{
   var result = {};
   result.href = "http://localhost:3000/api/memberships/" + item._id;
   result.account = {href: "http://localhost:3000/api/accounts/" + item.accountId};      // TODO: Pass in URI prefix somehow
   result.group = {href: "http://localhost:3000/api/groups/" + item.groupId};      // TODO: Pass in URI prefix somehow

   return result;
}
