const express = require('express');
const viewFileRoutes = express.Router();
const verifyAuth = require('../middlewares/verifyAuth');
const {
  viewFile,
  readOnline,
  download,
} =require('../controllers/viewFileRoutesController');


viewFileRoutes.get('/file', verifyAuth, viewFile)

viewFileRoutes.get('/readonline', verifyAuth, readOnline)

viewFileRoutes.get('/download', verifyAuth, download)

module.exports = viewFileRoutes;