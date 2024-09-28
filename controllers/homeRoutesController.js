const path = require('path');
const fs = require('fs');
const file = require('../models/fileModel');

const indexFile = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
}

const getFiles = async (req, res) => {
  try {
    const files = await file.find({}).sort({createdAt: -1});
    res.json(files);
  } catch (e) {
    res.status(500);
    console.log('Error getting files:', e.message)
  }
}

module.exports = {
  indexFile,
  getFiles,
}