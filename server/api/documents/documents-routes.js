'use strict';

var express = require('express');
var router = express.Router();
var Document = require('mongoose').model('Document');
var documents = require('./documents-logic');
var routeHandler = require('../../utilities/route-handler');

router.get('/api/documents', routeHandler.getList(Document, documents.mapping));                 // Get a list of documents
router.get('/api/documents/:itemId', routeHandler.getById(Document, documents.mapping));         // Get document given its Id
router.delete('/api/documents/:itemId', routeHandler.deleteById(Document));  // Delete document given its Id
router.post('/api/documents/:itemId', routeHandler.updateById(Document, documents.mapping));    // Update document given its Id
router.post('/api/documents', routeHandler.create(Document, documents.mapping));              // Create a new document
// CREATE should be in the path of the object that OWNS the documents, but that doesn't exist yet...

module.exports = router;
