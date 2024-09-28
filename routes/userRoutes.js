const express = require('express');
const userRoutes = express.Router();
const verifyAuth = require('../middlewares/verifyAuth');
const {
  fetchUserData,
} = require('../controllers/userRoutesController')

userRoutes.get('/', fetchUserData)

module.exports = userRoutes;