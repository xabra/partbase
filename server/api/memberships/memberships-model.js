var mongoose = require('mongoose');

var membershipSchema = mongoose.Schema({
   accountId: {
      type: mongoose.Schema.Types.ObjectId,
      required: '{PATH} is required!',
   },
   groupId: {
      type: mongoose.Schema.Types.ObjectId,
      required: '{PATH} is required!',
   },
});


var Membership = mongoose.model('Membership', membershipSchema);


// --- Populate DB with some dummy data.  TODO: move or eliminate this
function populateDBWithDummyData() {
   Membership.find({}).exec(function(err, collection) {
      if (collection.length === 0) {

         Membership.create({
            accountId: new mongoose.Types.ObjectId,
            groupId: new mongoose.Types.ObjectId,
         });

         Membership.create({
            accountId: new mongoose.Types.ObjectId,
            groupId: new mongoose.Types.ObjectId,
         });

      }
   })
};

exports.populateDBWithDummyData = populateDBWithDummyData;
