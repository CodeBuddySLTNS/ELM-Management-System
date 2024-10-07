const path = require('path');
const userModel = require('../models/userModel');
const configModel = require('../models/configModel');
const systemConfig = require('../config/systemConfig');

const fetchUserData = async (req, res) => {
  const { userId } = res.locals;
  try {
    const data = await userModel.findOne({ _id: userId });
    if (!data) {
      const userData = new Object();
      const configs = await configModel.findOne({_id: systemConfig.configId});
      if (configs) userData.configs = { ...configs._doc }
      return res.json({
        ...userData, 
        loggedIn: false,
        schoolName: systemConfig.schoolName,
        schoolLogo: systemConfig.schoolLogo,
        systemName: systemConfig.systemName
      });
    }
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
    
    const configs = await configModel.findOne({_id: systemConfig.configId});
    if (configs) userData.configs = { ...configs._doc }
    res.json({
      ...userData, 
      loggedIn: true,
      schoolName: systemConfig.schoolName,
      schoolLogo: systemConfig.schoolLogo,
      systemName: systemConfig.systemName
    });
  } catch (e) {
    res.status(500);
    console.log(e)
  }
}

module.exports = {
  fetchUserData,
}