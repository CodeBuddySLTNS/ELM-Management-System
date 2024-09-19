const express = require('express');
const loginRoutes = express.Router();
const {
  signup,
  login,
  loginPage,
  signupPage,
} = require('../controllers/loginRoutesController');

loginRoutes.route('/login').get(loginPage).post(login)

module.exports = loginRoutes;