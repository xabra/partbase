'use strict';

/*
*  Where the source object has keys that are in the target object, copy the source values to the targe
*  leaving the other values in the target unchanged
*/
exports.updateObjectValues = function(sourceObj, targetObj) {
   for (var key in sourceObj) {        // For each key in source...
      if(!(targetObj[key] === undefined)) {     // If the target has a corresponding key (ie the targetObj[key] is NOT undefined)...
         targetObj[key] = sourceObj[key];              // Then update the target
      }
   }
   return targetObj;
}
