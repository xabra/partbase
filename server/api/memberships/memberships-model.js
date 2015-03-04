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
