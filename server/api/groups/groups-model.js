var mongoose = require('mongoose');

var statusENUM = ['ENABLED', 'DISABLED'];

var groupSchema = mongoose.Schema({
   name: {
      type: String,
      required: '{PATH} is required!',
      unique: true,
   },
   description: {
      type: String,
   },
   status: {
      type: String,
      enum: statusENUM,
      required: '{PATH} is required!',
   },
});


var Group = mongoose.model('Group', groupSchema);

// --- Populate DB with some dummy data.  TODO: move or eliminate this
function populateDBWithDummyData() {
   Group.find({}).exec(function(err, collection) {
      if (collection.length === 0) {

         Group.create({
            name: 'Admins',
            description: 'Group of all admins',
            status: 'ENABLED',
         });

         Group.create({
            name: 'Engineers',
            description: 'Group of all engineers',
            status: 'ENABLED',
         });

         Group.create({
            name: 'Document Control',
            description: 'Doc control people with read only access',
            status: 'ENABLED',
         });
      }
   })
};

exports.populateDBWithDummyData = populateDBWithDummyData;
