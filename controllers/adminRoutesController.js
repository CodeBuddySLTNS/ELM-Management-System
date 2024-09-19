const path = require('path');
const userModel = require('../models/userModel');

const dashboard = async (req, res) => {
  res.send('admin dashboard');
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
    console.log(users)
    res.send(users);
  } catch (e) {
    res.status(500).json({error: e.message});
    console.log(e)
  }
}

const verifyUsers = async (req, res) => {
  const {username} = req.body;
  console.log(username);
  try {
    const user = await userModel.findOneAndUpdate({username}, {isVerified: true}, {new: true});
    res.json({success: true})
    console.log(user);
  } catch (e) {
    res.status(500).json({error: e.message})
    console.log(e);
  }
}

module.exports = {
  dashboard,
  manageUsers,
  verifyUsers,
}