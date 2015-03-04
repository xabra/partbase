var mongoose = require('mongoose');

var statusENUM = ['ENABLED', 'DISABLED', 'UNVERIFIED'];

var tenantSchema = mongoose.Schema({
   href: {
      type: String,     // Should be computed...?
   },
   name: {
      type: String,
      required: '{PATH} is required!',
      unique: true,
   },
   key: {
      type: String,
      required: '{PATH} is required!',
      unique: true,
   },
});


var Tenant = mongoose.model('Tenant', tenantSchema);

// --- Populate DB with some dummy data.  TODO: move or eliminate this
function populateDBWithDummyData() {
   Tenant.find({}).exec(function(err, collection) {
      if (collection.length === 0) {;
         Tenant.create({
            href: '',
            name: 'MIT',
            key: 'mit.edu',
         });
         Tenant.create({
            href: '',
            name: 'General Electric',
            key: 'ge.com',
         });
         Tenant.create({
            href: '',
            name: 'Vaxis Technologies',
            key: 'vaxistech.com',
         });
      }
   })
};

exports.populateDBWithDummyData = populateDBWithDummyData;
