const path = require('path');
const fs = require('fs');
const axios = require('axios');
const file = require('../models/fileModel');

const viewFile = async (req, res) => {
  const fileId = decodeURI(req.query.id);
  const info = req.query.info;
  if (info != 'true') {
    return res.sendFile(path.join(__dirname, '..', 'views', 'viewFile.html'));
  }
  try {
    const found = await file.findOne({_id: fileId});
    found ? res.json(found) : res.status(404);
  } catch (e) {
    res.status(500);
    console.log('Error viewFile:', e.message)
  }
}

const readOnline = async (req, res) => {
  const fileId = req.query.id;
  const read = req.query.read;
  if (read != 'true') return res.sendFile(path.join(__dirname, '..', 'views', 'readOnline.html'));
  
  try {
    const found = await file.findOne({_id: fileId});
    
    if (found) {
      console.log('found');
      const { data } = await axios.get(found.url, { responseType: 'arraybuffer' });
      if (data) {
        console.log('file sent')
        return res.send(data)
      };
      return console.log('File not sent');
    }
  } catch (e) {
    res.status(500);
    console.log('Error readOnline:', e.message)
  }
  
  console.log('not found')
}

const download = async (req, res) => {
  const fileId = req.query.id;
  
  try {
    const found = await file.findOne({_id: fileId});
    
    if (found) {
      console.log('found');
      const { data } = await axios.get(found.url, { responseType: 'arraybuffer' });
      
      console.log(data)
      
      if (data) {
        res.send(data);
        console.log('File sent.')
        return;
      }
      
      console.log('File not sent.')
      return;
    }
  } catch (e) {
    res.status(500);
    console.log('Error download:', e.message)
  }
  
  console.log('not found')
}

module.exports = {
  viewFile,
  readOnline,
  download,
}