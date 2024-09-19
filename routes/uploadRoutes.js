const express = require('express');
const multer = require('multer');
const path = require('path');
const uploadRoutes = express.Router();
const verifyAuth = require('../middlewares/verifyAuth');
const {
  upload,
  uploadPage,
} = require('../controllers/uploadRoutesController');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'cache', 'uploads'));
  },
  filename: (req, file, cb) => {
    console.log(file)
    if (file.mimetype === 'application/pdf') {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    } else {
      cb(new Error('Only PDF files allowed.'), false)
    }
  }
});

const multerUpload = multer({ storage });

uploadRoutes.use(multerUpload.fields([
    { name: 'pdfFiles', maxCount: 10 }
  ]));

uploadRoutes.get('/upload', verifyAuth, uploadPage);

uploadRoutes.post('/upload', verifyAuth, upload);

module.exports = uploadRoutes;