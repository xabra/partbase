var path = require('path');

var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
   development: {
      db: 'mongodb://localhost:27017/partbase',
      rootPath: rootPath,
      port: process.env.PORT || 3000,
      sessionSecretKey:'dzkjflkhIYGUYTDCLKJH9238jdlksd92n',
      sessionDuration: 20*60*60*1000,
      sessionActiveDuration: 20*60*60*1000,
      sessionEnableHTTPS: false,
   },
   production: {
      db: 'mongodb://localhost:27017/partbase',
      rootPath: rootPath,
      port: process.env.PORT || 80,
      sessionSecretKey:'dzkjflkhIYGUYTDCLKJH9238jdlksd92n',
      sessionDuration: 20*60*60*1000,
      sessionActiveDuration: 20*60*60*1000,
      sessionEnableHTTPS: false,
   }
}
