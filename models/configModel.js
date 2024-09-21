const mongoose = require('mongoose');
const configSchema = new mongoose.Schema({
  autoVerify: Boolean,
  departments: [String],
  categories: [String],
})

module.exports = mongoose.model('config', configSchema);