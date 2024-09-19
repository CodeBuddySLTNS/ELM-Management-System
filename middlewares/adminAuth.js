const path = require('path');
const userModel = require('../models/userModel');

const adminAuth = async (req, res, next) => {
  const { userId } = res.locals;
  const user = await userModel.findOne({_id:userId});
  if (!user) return res.redirect('/auth/login');
  console.log(user._doc.role)
  user._doc.role.toLowerCase() === 'admin' ?
    next() :
    res.status(409).send('Only administrators can access this route.');
}

module.exports = adminAuth;