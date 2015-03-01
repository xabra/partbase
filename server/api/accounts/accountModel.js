var mongoose = require('mongoose'),
  encrypt = require('../../utilities/encryption');

var accountSchema = mongoose.Schema({
  firstName: {type:String, required:'{PATH} is required!'},
  lastName: {type:String, required:'{PATH} is required!'},
  username: {
    type: String,
    required: '{PATH} is required!',
    unique:true
  },
  salt: {type:String, required:'{PATH} is required!'},
  hashed_pwd: {type:String, required:'{PATH} is required!'},
  roles: [String]
});

accountSchema.methods = {
  authenticate: function(passwordToMatch) {
    return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
  },
  hasRole: function(role) {
    return this.roles.indexOf(role) > -1;
  }
};

var Account = mongoose.model('Account', accountSchema);

function createDefaultAccounts() {
   Account.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
      var salt, hash;
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'joe');
      Account.create({firstName:'Joe',lastName:'Eames',username:'joe', salt: salt, hashed_pwd: hash, roles: ['admin']});
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'john');
      Account.create({firstName:'John',lastName:'Papa',username:'john', salt: salt, hashed_pwd: hash, roles: []});
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'dan');
      Account.create({firstName:'Dan',lastName:'Wahlin',username:'dan', salt: salt, hashed_pwd: hash});
    }
  })
};

exports.createDefaultAccounts = createDefaultAccounts;
