const express = require('express');
const fs = require('fs');
const path = require('path');
const fileModel = require('../models/fileModel');

const signupPage = async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
}
const signup = async (req, res) => {
  const userData = req.body;
<<<<<<< HEAD
  const profileImg = req.files.profileImg && req.files.profileImg.length > 0 ? req.files.profileImg[0] : null;
  
  if (profileImg) {
    const filePath = path.join(__dirname, '..', 'cache', 'uploads', profileImg.filename);
    fs.readFile(filePath, async (err, fileBuffer) => {
      try {
        const {data:img} = await axios.post(systemConfig.imgurUrl, fileBuffer, {
          headers: {
            "Authorization": "Client-Id 6bc5fd51c813512",
            "Content-Type": "application/octet-stream"
          }
        });
        
        // delete the image file
        fs.unlink(filePath, (err) => err ? `Error deleting the file ${filePath}.` : `${filePath} deleted.`);
        
        // call the function to register the new user
        registerNewUser(img.data.link);
        
      } catch (e) {
        res.status(500);
        console.log(e.message);
      }
    })
  } else {
    registerNewUser();
  }
  
  async function registerNewUser(imgLink) {
    try {
      const alreadyExists = await userModel.findOne({fullName: userData.fullName});
      
      if (alreadyExists) {
        console.log('alreadyExists')
        return res.status(409).send(`Account already exist.`);
      }
      
      // hash the password
      bcrypt.genSalt(10, (err, Salt) => {
        bcrypt.hash(userData.password, Salt, async (err, hash) => {
          userData.password = hash; // replace the password with hashed password
          userData.isVerified = false; // new accounts will be marked as unverified
          userData.role = 'Student'; // new accounts will be marked as student
          if (imgLink) userData.profileImg = imgLink; // attach the profile picture link
          
          try {
            const newAccount = await userModel.create(userData);
          
            console.log('Account created')
            
            const token = await createToken(newAccount._id);
            res.cookie('jwt', token);
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
=======
  console.log(userData);
>>>>>>> e620d148568f9121006b80425f48f26409fdf2d7
}

const loginPage = async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
}
const login = async (req, res) => {
  const { user, password } = req.body;
  console.log(user, password);
}

module.exports = {
  signup,
  login,
  signupPage,
  loginPage,
}