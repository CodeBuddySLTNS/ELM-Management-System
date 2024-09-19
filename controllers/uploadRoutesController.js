const fs = require('fs');
const path = require('path');
const { google }= require('googleapis');
const fileModel = require('../models/fileModel');
const apikeys = require('../config/gdrivekey.json');
const scope = ['https://www.googleapis.com/auth/drive'];

const uploadPage = async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'upload.html'))
}

const upload = async (req, res) => {
<<<<<<< HEAD
  try {
    const pdfFiles = req.files.pdfFiles;
    console.log(req.files.thumbnail)
    const thumbnail = req.files.thumbnail && req.files.thumbnail.length > 0 ? req.files.thumbnail[0] : null;
    const newFileData = req.body;
    const { _doc: acc } = await userModel.findOne({ _id: res.locals.userId });
    
    if (!pdfFiles) return res.status(500);
    
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
          fs.unlink(thumbnailPath, (err) => err ? 
            console.log(`Error deleting the file ${thumbnailPath}.`) : 
            console.log(`${thumbnailPath} deleted.`));
          
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
        if (pdfFiles.length > 0) {
          const results = new Array();
          for (file of pdfFiles) {
            try {
              await uploadFileData(file, newFileData, thumbnailLink, acc);
              results.push({
                filename: file.originalname,
                message: 'uploaded successfully.',
                error: false
              });
            } catch (e) {
              results.push({
                filename: file.originalname,
                message: e.message,
                error: true
              });
            }
          }
          res.json({success: true, ...results});
          console.log(results);
        }
      } catch (e) {
        res.status(500);
        console.log(e);
      }
    }
  } catch (e) {
    res.status(500);
    console.log('Error at Upload Route:', e);
=======
  const dataFiles = req.files;
  if (!dataFiles) return;
  const { originalname, filename, mimetype } = dataFiles?.pdfFiles[0];
  const fileName = originalname.slice(0, originalname.lastIndexOf('.'));
  const filePath = path.join(__dirname, `../cache/uploads/${filename}`);
  
  const { id, name, webContentLink } = await uploadFile(originalname, filePath);
  //const alreadyExist = await fileModel.findOne({});
  
  console.log(name)
  
  const pdfData = {
    fileName: name,
    fileId: id,
    name: name.slice(0, name.lastIndexOf('.')),
    url: webContentLink,
    mimeType: mimetype,
    category: 'Computer and Technologies',
    department: 'BSIT',
    uploader: 'BSIT Student',
>>>>>>> e620d148568f9121006b80425f48f26409fdf2d7
  }
  // await fileModel.deleteMany({})
  await fileModel.create(pdfData);
  console.log(await fileModel.find({}))
  
  res.json({response: 'File uploaded successfully!'});
}



// A Function that can provide access to google drive api
async function authorize(){
  const jwtClient = new google.auth.JWT(
    apikeys.client_email,
    null,
    apikeys.private_key,
    scope
  );
  await jwtClient.authorize();
  return jwtClient;
}

// A Function that will upload the desired file to google drive folder
async function uploadFile(fileName, filePath){
  try {
    const drive = google.drive({version: 'v3', auth: await authorize()});
    
    const fileMetaData = {
      name: fileName,
      parents: ['1sqswJVZNhuvm8Gy34dKN1ZFR72iB-Xk3'] // A folder ID to which file will get uploaded
    }
    
    const uploaded = await drive.files.create({
      resource: fileMetaData,
      media: {
        body: fs.createReadStream(filePath), // files that will get uploaded
        mimeType: 'application/pdf'
      },
      fields: 'id, name, hasThumbnail, thumbnailLink'
     });
    
    if (!uploaded) return null;
    
    const webContentLink = await generatePublicUrl(uploaded.data.id, drive);
    
    const fileData = {...uploaded.data, webContentLink}
    return fileData;
    
  } catch (e) {
    console.log('Error uploading file:', e.message)
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
  uploadPage,
}