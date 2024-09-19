const express = require('express');
const viewFileRoutes = express.Router();
const {
  viewFile,
  readOnline,
  download,
} =require('../controllers/viewFileRoutesController');


viewFileRoutes.get('/file', viewFile)

viewFileRoutes.get('/readonline', readOnline)

viewFileRoutes.get('/download', download)

module.exports = viewFileRoutes;