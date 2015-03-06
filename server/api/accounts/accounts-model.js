var mongoose = require('mongoose');
var encrypt = require('../../utilities/encryption');

var statusENUM = ['ENABLED', 'DISABLED', 'UNVERIFIED'];

var accountSchema = mongoose.Schema({

   username: {
      type: String,
      required: '{PATH} is required!',
      unique: true,
   },
   email: {
      type: String,
      required: '{PATH} is required!',
      unique: true,
   },
   givenName: {
      type: String,
      required: '{PATH} is required!',
   },
   surname: {
      type: String,
      required: '{PATH} is required!',
   },
   salt: {
      type: String,
      required: '{PATH} is required!',
      unique: true,
   },
   hashed_pwd: {
      type: String,
      required: '{PATH} is required!',
      unique: true,
   },
   status: {
      type: String,
      enum: statusENUM,
      required: '{PATH} is required!',
      default: 'ENABLED',
   },
   emailVerificationToken: {
      type: String,
      default: '',
   },
});

accountSchema.methods = {
   authenticate: function(passwordToMatch) {
      return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
   },
   hasRole: function(role) {
      return this.groups.indexOf(group) > -1;
   }
};

accountSchema.virtual('href').get(function(){
   return 'https://blahblah/' + this._id;
});

// TODO: add virtual functions to compute Full Name and HREFs based on object IDs

var Account = mongoose.model('Account', accountSchema);

// --- Populate DB with some dummy data.  TODO: move or eliminate this
function populateDBWithDummyData() {
   Account.find({}).exec(function(err, collection) {
      if (collection.length === 0) {
         var salt, hash;
         salt = encrypt.createSalt();
         hash = encrypt.hashPwd(salt, 'joe');
         Account.create({
            username: 'joe',
            email: 'joe@x.com',
            givenName: 'Joe',
            surname: 'Smith',
            salt: salt,
            hashed_pwd: hash,
            status: 'ENABLED',
            emailVerificationToken: '',
         });
         salt = encrypt.createSalt();
         hash = encrypt.hashPwd(salt, 'john');
         Account.create({
            username: 'john',
            email: 'john@x.com',
            givenName: 'John',
            surname: 'Smith',
            salt: salt,
            hashed_pwd: hash,
            status: 'ENABLED',
            emailVerificationToken: '',
         });
         salt = encrypt.createSalt();
         hash = encrypt.hashPwd(salt, 'dan');
         Account.create({
            username: 'dan',
            email: 'dan@x.com',
            givenName: 'John',
            surname: 'Smith',
            salt: salt,
            hashed_pwd: hash,
            status: 'DISABLED',
            emailVerificationToken: '',
         });
      }
   })
};

exports.populateDBWithDummyData = populateDBWithDummyData;
