const express = require('express');
const loginRoutes = express.Router();
const {
  login,
  loginPage,
  signup,
  signupPage,
  logout,
} = require('../controllers/loginRoutesController');

loginRoutes.route('/login').get(loginPage).post(login);

loginRoutes.route('/signup').get(signupPage).post(signup);

loginRoutes.get('/logout', logout);

module.exports = loginRoutes;