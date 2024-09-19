const path = require('path');
const userModel = require('../models/userModel');

const fetchUserData = async (req, res) => {
  const { userId } = res.locals;
  try {
    const data = await userModel.findOne({ _id: userId });
    if (!data) return res.status(404).send('User not found.');
    const userData = {
      fullName: data._doc.fullName,
      firstName: data._doc.firstName,
      middleName: data._doc.middleName,
      lastName: data._doc.lastName,
      username: data._doc.username,
      yearLevel: data._doc.yearLevel,
      department: data._doc.department,
      email: data._doc.email,
      profileImg: data._doc.profileImg,
      isVerified: data._doc.isVerified,
      role: data._doc.role,
    }
    res.json(userData);
  } catch (e) {
    res.status(500);
    console.log(e)
  }
}

module.exports = {
  fetchUserData,
}