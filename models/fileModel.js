const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    unique: true,
    required: true
  },
  fileId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    unique: true,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  uploader: {
    type: String,
  },
}, { timestamps: true})

module.exports = mongoose.model('file', fileSchema);