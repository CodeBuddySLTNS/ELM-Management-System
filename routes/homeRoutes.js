const express = require('express');
const homeRoutes = express.Router();
const {
  indexFile,
  getFiles,
} = require('../controllers/homeRoutesController')

homeRoutes.get('/', indexFile);

homeRoutes.get('/files', getFiles)

module.exports = homeRoutes;