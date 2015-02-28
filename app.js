var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var auth = require('./api/auth');
var routes = require('./api/routes');
var mongo = require('./api/mongo');

var app = express();

/**
 *  === Initialize Mongo DB connection ===
 */
mongo.init(app, {
   mongoHost: 'localhost',
   mongoPort: '27017',
   mongoDBName: 'partbase',   //Comment
});


/**
 * === Set up Middleware
 */
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
*  === Initialize Authentication Middleware, Including Stormpath  ===
*/
auth.init(app, {
   secretKey: 'dzkjflkhIYGUYTDCLKJH9238jdlksd92n',
   enableHTTPS: false,
   sessionDuration: 20*60*60*1000,
   stormpathApiKeyFile: process.env.HOME + '/dev/keys/stormpath-apikey.properties',
   stormpathApplicationURL: 'https://api.stormpath.com/v1/applications/7dPCdUUTIwYZTDY81jXitE',
});


// Serve static pages
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
   console.log("^^^ Request.session.user:" + JSON.stringify(req.session.user));
   next();
});

/**
 * === Set up custom routes
 */

app.use('/', routes);

/**
 *  === Error Handling
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
   app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
         message: err.message,
         error: err
      });
   });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render('error', {
      message: err.message,
      error: {}
   });
});


module.exports = app;
