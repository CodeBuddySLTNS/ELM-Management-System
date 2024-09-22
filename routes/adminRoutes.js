const express = require('express');
const adminRoutes = express.Router();
const verifyAuth = require('../middlewares/verifyAuth');
const adminAuth = require('../middlewares/adminAuth');
const {
  dashboard,
  manageUsers,
  verifyUsers,
  makeAdmin,
} = require('../controllers/adminRoutesController');

adminRoutes.get('/', verifyAuth, adminAuth, dashboard);

adminRoutes.get('/manage', verifyAuth, adminAuth, manageUsers);

adminRoutes.patch('/manage/verify', verifyAuth, adminAuth, verifyUsers);

adminRoutes.patch('/manage/promote', verifyAuth, adminAuth, makeAdmin);

module.exports = adminRoutes;