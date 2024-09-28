const mongoose = require('mongoose');
const configSchema = new mongoose.Schema({
  autoVerify: Boolean,
  allowStudentUpload: Boolean,
  departments: [String],
  categories: [String],
})

module.exports = mongoose.model('config', configSchema);