const express = require('express');
const homeRoutes = express.Router();
const verifyAuth = require('../middlewares/verifyAuth');
const {
  indexFile,
  getFiles,
} = require('../controllers/homeRoutesController')

homeRoutes.get('/', verifyAuth, indexFile);

homeRoutes.get('/files', verifyAuth, getFiles)

module.exports = homeRoutes;