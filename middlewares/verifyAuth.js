const jwt = require('jsonwebtoken');
const path = require('path');
const userModel = require('../models/userModel');
const systemConfig = require('../config/systemConfig');

const verifyAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (token) {
      jwt.verify(token, process.env.SYSTEM_SECRET_KEY, async (err, verifiedToken) => {
        try {
          if (verifiedToken) {
            const user = await userModel.findOne({ _id: verifiedToken.id });
            if (!user) {
              return res.redirect('/auth/login')
            };
            
            res.locals.userId = verifiedToken.id;
            
            if (user._doc.isVerified) {
              console.log(user._doc.role, req.path)
              if (req.path === '/upload' && user._doc.role === 'Student') {
                return res.sendFile(path.join(__dirname, '..', 'views', 'uploadNotAllowed.html')) 
              }
              return next();
            }
            systemConfig.onlyVerifiedUsers ?
              res.status(401).sendFile(path.join(__dirname, '..', 'views', 'unauthorized.html')) :
              next();
          } else {
            res.redirect('/auth/login');
            return;
          }
        } catch (e) {
          console.log(e);
          systemConfig.DevMode ?
            next() :
            res.status(500).send('Internal server error.');
        }
      });
    } else {
      if (systemConfig.DevMode) return next();
      res.redirect('/auth/login');
      return;
    };
  } catch (e) {
    console.log(e)
  }
}

module.exports = verifyAuth;