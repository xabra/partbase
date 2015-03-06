'use strict';

// TODO: Better error checking




exports.mapping = function(item)
{
   var result = {};
   result.href = "http://localhost:3000/api/documents/" + item._id;      // TODO: Pass in URI prefix somehow
   result.title = item.title;
   result.description = item.description;
   result.docType = item.docType;
   result.partType = item.partType;
   result.project = item.project;
   result.author = item.author;
   result.createdDate = item.createdDate;
   result.revision = item.revision;
   result.documentNum = item.documentNum;

   return result;
}

//====================   SNIPPET - NOT DOING ANYTHING ....
function getNextSequence(db, name, callback) {
   var nextSeq = null;
   var collection = db.collection('counters');
   collection.findAndModify( { _id: name }, [['_id',1]], { $inc: { seq: 1 } }, {new: true}, function(err, ret){
      assert.equal(null, err);
      nextSeq = ret.value.seq;
      //console.log('>>> SERVER next seq = : '+ nextSeq);
      callback(nextSeq);
   });
}
