const path = require('path');
const userModel = require('../models/userModel');

const dashboard = async (req, res) => {
  if (!req.query.data) return res.sendFile(path.join(__dirname, '..', 'views', 'adminPanel.html'));
  
  try {
    const accounts = await userModel.find({});
    const students = await userModel.find({role: 'Student'});
    const pending = await userModel.find({isVerified: false});
    
    const result = {
      totalAccounts: accounts.length, 
      totalStudents: students.length, 
      pendingAccounts: pending.length, 
    }
    res.json(result);
  } catch (e) {
    res.status(500).send(e.message);
    console.log(e);
  }
}

const manageUsers = async (req, res) => {
  if (!req.query.data) return res.sendFile(path.join(__dirname, '..', 'views', 'manageUsers.html'));
  
  try {
    const usersData = await userModel.find({});
    const users = usersData.map(user => ({
      id: user._id,
      fullName: user.fullName,
      yearLevel: user.yearLevel,
      department: user.department,
      email: user.email,
      username: user.username,
      isVerified: user.isVerified,
      role: user.role
    }));
    res.send(users);
  } catch (e) {
    res.status(500).json({error: e.message});
    console.log(e)
  }
}

const verifyUsers = async (req, res) => {
  const {username} = req.body;
  try {
    const user = await userModel.findOneAndUpdate({username}, {isVerified: true}, {new: true});
    res.json({success: true})
  } catch (e) {
    res.status(500).json({error: e.message})
    console.log(e);
  }
}

const makeAdmin = async (req, res) => {
  const {username} = req.body;
  try {
    const user = await userModel.findOneAndUpdate({username}, {role: 'Admin'}, {new: true});
    res.json({success: true})
  } catch (e) {
    res.status(500).json({error: e.message})
    console.log(e);
  }
}

const allowStudentUpload = async (req, res) => {
  
}

module.exports = {
  dashboard,
  manageUsers,
  verifyUsers,
  makeAdmin,
}