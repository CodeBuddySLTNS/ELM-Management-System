const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  yearLevel: {
    type: Number,
  },
  department: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profileImg: {
    type: String,
  },
  isVerified: {
    type: Boolean,
  },
  role: {
    type: String,
  }
}, {timestamps: true})

module.exports = mongoose.model('user', userSchema);