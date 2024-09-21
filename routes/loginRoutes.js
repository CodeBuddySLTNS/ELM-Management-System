const express = require('express');
const loginRoutes = express.Router();
const multerUpload = require('../middlewares/multerUpload');
const {
  login,
  loginPage,
  signup,
  signupPage,
  logout,
} = require('../controllers/loginRoutesController');

loginRoutes.route('/login').get(loginPage).post(login);

loginRoutes.route('/signup').get(signupPage).post(multerUpload.fields([
    { name: 'profileImg', maxCount: 1 }
  ]), signup);

loginRoutes.get('/logout', logout);

module.exports = loginRoutes;