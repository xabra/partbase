var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
//var passport = require('passport');

module.exports = function(app, config) {

  //app.configure(function() {

    app.use(favicon(config.rootPath + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(config.rootPath + '/public'));

  //});
}
