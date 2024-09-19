const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  }
  firstName: {
    type: String,
    required: true
  }
  middleName: {
    type: String,
    required: true
  }
  lastName: {
    type: String,
    required: true
<<<<<<< HEAD
  },
  yearLevel: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
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
=======
  }
  department: {
    type: String,
    required: true
>>>>>>> e620d148568f9121006b80425f48f26409fdf2d7
  }
}, {timestamps: true})

module.exports = mongoose.model('user', userSchema);