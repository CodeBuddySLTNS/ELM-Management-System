const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fileModel = require('../models/fileModel');
const userModel = require('../models/userModel');
const systemConfig = require('../config/systemConfig');

const secret = process.env.SYSTEM_SECRET_KEY;
const expiration = 12 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({id}, secret, {expiresIn: expiration});
}

const signupPage = async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
}

const signup = async (req, res) => {
  const userData = req.body;
  const profileImg = req.files.profileImg && req.files.profileImg.length > 0 ? req.files.profileImg[0] : null;
  
  if (profileImg) {
    const filePath = path.join(__dirname, '..', 'cache', 'uploads', profileImg.filename);
    fs.readFile(filePath, async (err, fileBuffer) => {
      try {
        const {data:img} = await axios.post(systemConfig.imgurUrl, fileBuffer, {
          headers: {
            "Authorization": process.env.IMGUR_CLIENT_ID,
            "Content-Type": "application/octet-stream"
          }
        });
        
        // delete the image file
        fs.unlink(filePath, (err) => err ? `Error deleting the file ${filePath}.` : `${filePath} deleted.`);
        
        // call the function to register the new user
        registerNewUser(img.data.link);
        
      } catch (e) {
        res.status(500);
        console.log(e);
      }
    })
  } else {
    registerNewUser();
  }
  
  async function registerNewUser(imgLink) {
    try {
      const accountExist = await userModel.findOne({fullName: userData.fullName});
      const usernameExist = await userModel.findOne({fullName: userData.username});
      
      if (accountExist) return res.json({loggedIn: false, accountExist: true});
      if (usernameExist) return res.json({loggedIn: false, usernameExist: true});
        
      // hash the password
      bcrypt.genSalt(10, (err, Salt) => {
        bcrypt.hash(userData.password, Salt, async (err, hash) => {
          userData.password = hash; // replace the password with hashed password
          userData.isVerified = false; // new accounts will be marked as unverified
          userData.role = 'Student'; // new accounts will be marked as student
          if (imgLink) userData.profileImg = imgLink; // attach the profile picture link
          
          try {
            const newAccount = await userModel.create(userData);
          
            const token = await createToken(newAccount._id);
            res.cookie('jwt', token, {httpOnly: true, maxAge: expiration * 1000});
            res.status(201).json({ id: newAccount._id, loggedIn: true })
          } catch (e) {
            res.status(500).json({ error: e.message })
          }
        })
      })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
  console.log(userData);
}

const facultySignupPage = async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'facultySignup.html'));
}

const facultySignup = async (req, res) => {
  const userData = req.body;
  const profileImg = req.files.profileImg && req.files.profileImg.length > 0 ? req.files.profileImg[0] : null;
  
  if (profileImg) {
    const filePath = path.join(__dirname, '..', 'cache', 'uploads', profileImg.filename);
    fs.readFile(filePath, async (err, fileBuffer) => {
      try {
        const {data:img} = await axios.post(systemConfig.imgurUrl, fileBuffer, {
          headers: {
            "Authorization": process.env.IMGUR_CLIENT_ID,
            "Content-Type": "application/octet-stream"
          }
        });
        
        // delete the image file
        fs.unlink(filePath, (err) => err ? `Error deleting the file ${filePath}.` : `${filePath} deleted.`);
        
        // call the function to register the new user
        registerNewUser(img.data.link);
        
      } catch (e) {
        res.status(500);
        console.log(e);
      }
    })
  } else {
    registerNewUser();
  }
  
  async function registerNewUser(imgLink) {
    try {
      const accountExist = await userModel.findOne({fullName: userData.fullName});
      const usernameExist = await userModel.findOne({username: userData.username});
      
      if (accountExist) return res.json({loggedIn: false, accountExist: true});
      if (usernameExist) return res.json({loggedIn: false, usernameExist: true});
      
      // hash the password
      bcrypt.genSalt(10, (err, Salt) => {
        bcrypt.hash(userData.password, Salt, async (err, hash) => {
          userData.password = hash; // replace the password with hashed password
          userData.isVerified = false; // new accounts will be marked as unverified
          userData.role = 'Faculty'; // set the role to Faculty
          if (imgLink) userData.profileImg = imgLink; // attach the profile picture link
          
          try {
            const newAccount = await userModel.create(userData);
          
            const token = await createToken(newAccount._id);
            res.cookie('jwt', token, {httpOnly: true, maxAge: expiration * 1000});
            res.status(201).json({ id: newAccount._id, loggedIn: true })
          } catch (e) {
            res.status(500).json({ error: e.message })
          }
        })
      })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
  console.log(userData);
}

const loginPage = async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
}

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({username});
    
    if (!user) return res.status(400).json({usernameError:true})
    
    bcrypt.compare(password, user._doc.password, async (err, match) => {
      if (err) return console.log('wrong', err)
      if (match) {
        const token = await createToken(user._doc._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: expiration * 1000});
        return res.status(201).json({ id: user._doc._id, loggedIn: true })
      }
      res.status(400).json({passwordError:true});
    })
  } catch (e) {
    console.log(e);
    res.status(500);
  }
}

const logout = async (req, res) => {
  res.cookie('jwt', '', {maxAge: 1});
  res.json({ loggedOut: true });
}

module.exports = {
  signup,
  login,
  signupPage,
  loginPage,
  facultySignupPage,
  facultySignup,
  logout,
}