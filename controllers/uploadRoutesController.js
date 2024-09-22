const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { google }= require('googleapis');
const fileModel = require('../models/fileModel');
const userModel = require('../models/userModel');
const apikeys = JSON.parse(process.env.GDRIVE_KEY);
const systemConfig = require('../config/systemConfig');

const uploadPage = async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'upload.html'))
}

const upload = async (req, res) => {
  try {
    const files = req.files.files;
    const thumbnail = req.files.thumbnail && req.files.thumbnail.length > 0 ? req.files.thumbnail[0] : null;
    const newFileData = req.body;
    const { _doc: acc } = await userModel.findOne({ _id: res.locals.userId });
    
    if (!files) return res.status(500);
    
    if (thumbnail) {
      const thumbnailPath = path.join(__dirname, '..', 'cache', 'uploads', thumbnail.filename);
      fs.readFile(thumbnailPath, async (err, fileBuffer) => {
        try {
          const {data:img} = await axios.post(systemConfig.imgurUrl, fileBuffer, {
              headers: {
                "Authorization": process.env.IMGUR_CLIENT_ID,
                "Content-Type": "application/octet-stream"
              }
            });
            
          // delete the image file
          fs.unlink(thumbnailPath, (err) => {});
          
          loopAndUpload(img.data.link);
        } catch (e) {
          res.status(500);
          console.log('Error uploading files:', e);
        }
      });
    } else {
      loopAndUpload();
    }
    
    async function loopAndUpload(thumbnailLink) {
      try {
        if (files.length > 0) {
          const results = new Array();
          for (file of files) {
            try {
              await uploadFileData(file, newFileData, thumbnailLink, acc);
              results.push({
                filename: newFileData.filename || file.originalname,
                message: 'uploaded successfully.',
                error: false
              });
            } catch (e) {
              results.push({
                filename: newFileData.filename || file.originalname,
                message: e.message,
                error: true
              });
            }
          }
          res.json(results);
        }
      } catch (e) {
        res.status(500);
        console.log(e);
      }
    }
  } catch (e) {
    res.status(500);
    console.log('Error at Upload Route:', e);
  }
}
  

 
 async function uploadFileData(file, newFileData, thumbnailLink, acc){
  const filePath = path.join(__dirname, '..', 'cache', 'uploads', file.filename);
  try {
    const exist = await fileModel.findOne({fileName: newFileData.filename || file.originalname});
    if (exist) throw new Error('File already exist.');
    if (file.mimetype !== 'application/pdf') throw new Error('We only support pdf files.');
    const { id, name, webContentLink } = await uploadFile(newFileData.filename || file.originalname, filePath, file.mimetype);
    
    const pdfData = {
      fileName: name,
      fileId: id,
      name: newFileData.filename || name.slice(0,name.lastIndexOf('.')),
      url: webContentLink,
      mimeType: file.mimetype,
      category: newFileData.category,
      department: newFileData.department,
      uploader: acc.firstName + ' ' + acc.lastName,
    }
    
    if (thumbnailLink) pdfData.thumbnail = thumbnailLink;
    
    await fileModel.create(pdfData);
    
    // delete the file
    fs.unlink(filePath, (err) => {});
  } catch (e) {
    // delete the file
    fs.unlink(filePath, (err) => {});
    throw new Error(e);
  }
}


// A Function that can provide access to google drive api
async function authorize(){
  const jwtClient = new google.auth.JWT(
    apikeys.client_email,
    null,
    apikeys.private_key,
    systemConfig.gdriveScope,
  );
  await jwtClient.authorize();
  return jwtClient;
}

// A Function that will upload the desired file to google drive folder
async function uploadFile(fileName, filePath, mimetype){
  try {
    const drive = google.drive({version: 'v3', auth: await authorize()});
    
    const fileMetaData = {
      name: fileName,
      parents: systemConfig.gdriveFolder, // A folder ID to which file will be uploaded
    }
    
    const uploaded = await drive.files.create({
      resource: fileMetaData,
      media: {
        body: fs.createReadStream(filePath), // files that will get uploaded
        mimeType: mimetype
      },
      fields: 'id, name, hasThumbnail, thumbnailLink'
     });
    
    if (!uploaded) return null;
    
    const webContentLink = await generatePublicUrl(uploaded.data.id, drive);
    
    const fileData = {...uploaded.data, webContentLink}
    return fileData;
    
  } catch (e) {
    console.log(e);
    return null;
  }
}

// A Function that delete a file in gdrive
async function deleteFile(fileId){
  try {
    const drive = google.drive({version: 'v3', auth: await authorize()});
    const deleteFile = await drive.files.delete({
      fileId: fileId,
    }, (err, file) => {
      if (err) return console.log('Error deleting file:', err.message);
      console.log(file.data);
    })
  } catch (e) {
    console.log('Error deleting file:', e.message)
  }
}

// A Function that generates a public url that can be accessed by anyone
async function generatePublicUrl(fileId, drive){
  try {
    const permission = await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    })
    
    const result = await drive.files.get({
      fileId: fileId,
      fields: 'webContentLink'
    });
    return result.data.webContentLink;
  } catch (e) {
    console.log('Error generating public url:', e.message);
    return null;
  }
}

module.exports = {
  upload,
  uploadPage
}