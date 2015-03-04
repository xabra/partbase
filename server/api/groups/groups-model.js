var mongoose = require('mongoose');

var statusENUM = ['ENABLED', 'DISABLED'];

var groupSchema = mongoose.Schema({
   href: {
      type: String,
   },
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
   accounts: {    // TODO: Needs work...Link to the accounts contained in this group
      type: String,
   },
});


var Group = mongoose.model('Group', groupSchema);

// --- Populate DB with some dummy data.  TODO: move or eliminate this
function populateDBWithDummyData() {
   Group.find({}).exec(function(err, collection) {
      if (collection.length === 0) {

         Group.create({
            href: '',
            name: 'Admins',
            description: 'Group of all admins',
            status: 'ENABLED',
            accounts: '',
         });

         Group.create({
            href: '',
            name: 'Engineers',
            description: 'Group of all engineers',
            status: 'ENABLED',
            accounts: '',
         });

         Group.create({
            href: '',
            name: 'Document Control',
            description: 'Doc control people with read only access',
            status: 'ENABLED',
            accounts: '',
         });
      }
   })
};

exports.populateDBWithDummyData = populateDBWithDummyData;
