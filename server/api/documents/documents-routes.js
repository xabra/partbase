'use strict';

var express = require('express');
var router = express.Router();
var documents = require('./documents-logic');


router.get('/api/documents', documents.getList);                 // Get a list of documents
router.get('/api/documents/:documentId', documents.getById);         // Get document given its Id
router.delete('/api/documents/:documentId', documents.deleteById);  // Delete document given its Id
router.post('/api/documents/:documentId', documents.updateById);    // Update document given its Id
router.post('/api/documents', documents.create);              // Create a new document
// CREATE should be in the path of the object that OWNS the documents, but that doesn't exist yet...

module.exports = router;
