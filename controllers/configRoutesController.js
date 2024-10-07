const systemConfig = require('../config/systemConfig');
const configModel = require('../models/configModel');

const signupConfigs = async (req, res) => {
  try {
    const configs = await configModel.findOne({_id: systemConfig.configId});
    if (configs) return res.json({
      departments: configs._doc.departments,
      schoolLogo: systemConfig.schoolLogo,
    });
    res.status(404).send('not found.')
  } catch (e) {
    res.status(500);
    console.log(e)
  }
}

const generalConfigs = async (req, res) => {
  try {
    const configs = await configModel.findOne({_id: systemConfig.configId});
    if (configs) return res.json(configs._doc);
    res.status(404).send('not found.')
  } catch (e) {
    res.status(500);
    console.log(e)
  }
}

module.exports = {
  signupConfigs,
  generalConfigs
}