const express = require('express');
const multer = require('multer');
const path = require('path');
const uploadRoutes = express.Router();
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

uploadRoutes.route('/upload').get(uploadPage).post(upload);

module.exports = uploadRoutes;