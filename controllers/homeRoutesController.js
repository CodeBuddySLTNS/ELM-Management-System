const path = require('path');
const fs = require('fs');
const file = require('../models/fileModel');
const configModel = require('../models/configModel');
const systemConfig = require('../config/systemConfig');

const indexFile = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
}

const getFiles = async (req, res) => {
  try {
    const { category, department } = req.query;
    // A function that filters the search based on the category and department from request
    const searchFilter = async () => {
      const { _doc:configs } = await configModel.findOne({_id: systemConfig.configId});
      if (configs) {
        configs.categories.unshift('Recent');
        configs.categories.unshift('All');
        configs.departments.unshift('All');
        configs.departments.unshift('General');
        
        let filter = new Object();
        for (categ of configs.categories) {
          if (categ == category) {
            for (depart of configs.departments) {
              if (depart == department) {
                if (category !== 'All' && category !== 'Recent') filter.category = category;
                if (department !== 'All') filter.department = department;
                
                if (category == 'Recent') {
                  const files = await file.find(filter).sort({createdAt: -1});
                  return res.json(files);
                } else {
                  const files = await file.find(filter);
                  return res.json(files);
                }
              }
            }
          }
        }
        // Recently added files will be sent by default
        const files = await file.find({}).sort({createdAt: -1});
        res.json(files);
      }
    }
    
    // call the function to filter the search
    searchFilter()
  } catch (e) {
    res.status(500);
    console.log('Error getting files:', e.message)
  }
}

module.exports = {
  indexFile,
  getFiles,
}