var mongoose = require('mongoose');

var documentSchema = mongoose.Schema({
   title: {
      type: String,
      required: '{PATH} is required!',
   },
   description: {
      type: String,
      default: '',
   },
   docType: {
      type: String,
      default: '',
   },
   partType: {
      type: String,
      default: '',
   },
   project: {
      type: String,
      default: '',
   },
   author: {
      type: String,
      default: '',
   },
   createdDate: {
      type: Date,
      default: Date.now,
   },
   revision: {
      type: Number,
      default: 0,
   },
   documentNum: {
      type: String,
      default: '',
   },
});


var Document = mongoose.model('Document', documentSchema);

// --- Populate DB with some dummy data.  TODO: move or eliminate this
function populateDBWithDummyData() {
   Document.find({}).exec(function(err, collection) {
      if (collection.length === 0) {;
         Document.create({
            title: 'MIT',
            description: 'Mark 7 Plasma Generator',
            docType: 'Assembly Model',
            partType: 'Proprietary',
            project: 'Plasma Source',
            author: 'AAB',
            revision: 2,
            documentNum: 'ESK-002-334234',
         });
      }
   })
};

exports.populateDBWithDummyData = populateDBWithDummyData;
