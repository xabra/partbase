'use strict';

var express = require('express');
var router = express.Router();

var documents = require('./documents-controller');

router.get('/api/documents', documents.getList());                 // Get a list of documents
router.get('/api/documents/:itemId', documents.getById());         // Get document given its Id
router.delete('/api/documents/:itemId', documents.deleteById());  // Delete document given its Id
router.post('/api/documents/:itemId', documents.updateById());    // Update document given its Id
router.post('/api/documents', documents.create());              // Create a new document

module.exports = router;
