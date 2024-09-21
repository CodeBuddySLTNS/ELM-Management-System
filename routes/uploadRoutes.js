const express = require('express');
const path = require('path');
const uploadRoutes = express.Router();
const verifyAuth = require('../middlewares/verifyAuth');
const multerUpload = require('../middlewares/multerUpload');
const {
  upload,
  uploadPage,
} = require('../controllers/uploadRoutesController');

uploadRoutes.use(multerUpload.fields([
    { name: 'files', maxCount: 10 },
    { name: 'thumbnail', maxCount: 1 }
  ]));

uploadRoutes.get('/upload', verifyAuth, uploadPage);

uploadRoutes.post('/upload', verifyAuth, upload);

module.exports = uploadRoutes;