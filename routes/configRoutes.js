const express = require('express');
const configRoutes = express.Router();
const verifyAuth = require('../middlewares/verifyAuth');
const adminAuth = require('../middlewares/adminAuth');
const { signupConfigs, generalConfigs } = require('../controllers/configRoutesController');

configRoutes.get('/signup', signupConfigs);

configRoutes.get('/general', verifyAuth, generalConfigs);

module.exports = configRoutes;