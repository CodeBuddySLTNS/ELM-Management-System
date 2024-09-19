const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();

const dbConnect = require('./config/dbConnection');
const file = require('./models/fileModel');
const fileData = {
  name: 'PC ASSEMBLE',
  imageUrl: 'https://i.imgur.com/RFuaF29.jpeg',
  category: 'Computer and Technologies'
}


// require('./models/userModel').deleteMany({}).then(d => console.log(d))

const app = express();
const port = 5000;

// middlewares
app.use((req, res, next) => {
  console.log(req.path)
  next()
})
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use(require('./routes/homeRoutes'));
app.use('/files', require('./routes/viewFileRoutes'));
app.use('/files', require('./routes/uploadRoutes'));
app.use('/auth', require('./routes/loginRoutes'));
<<<<<<< HEAD
app.use('/user', require('./routes/userRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
=======
>>>>>>> e620d148568f9121006b80425f48f26409fdf2d7



// Filename - index.js

// Requiring module
const bcrypt = require('bcryptjs');

const password = 'pass123';
let hashedPassword;

// Encryption of the string password
bcrypt.genSalt(10, function (err, Salt) {

    // The bcrypt is used for encrypting password.
    bcrypt.hash(password, Salt, function (err, hash) {

        if (err) {
            return console.log('Cannot encrypt');
        }

        hashedPassword = hash;
        console.log(hash);

        bcrypt.compare(password, hashedPassword,
            async function (err, isMatch) {

                // Comparing the original password to
                // encrypted password
                if (isMatch) {
                    console.log('Encrypted password is: ', password);
                    console.log('Decrypted password is: ', hashedPassword);
                }

                if (!isMatch) {

                    // If password doesn't match the following
                    // message will be sent
                    console.log(hashedPassword + ' is not encryption of '
                        + password);
                }
            })
        bcrypt.compare('password', hashedPassword,
            async function (err, isMatch) {

                // Comparing the original password to
                // encrypted password
                if (isMatch) {
                    console.log('Encrypted password is: ', password);
                    console.log('Decrypted password is: ', hashedPassword);
                }

                if (!isMatch) {

                    // If password doesn't match the following
                    // message will be sent
                    console.log(hashedPassword + ' is not encryption of '
                        + password);
                }
            })
    })
})



// only run the server when connected to database
dbConnect().then((res) => {
  console.log('Database connected:', res.connection.name, res.connection.host);
  app.listen(port, () => console.log(`Server running on port ${port}`))})
  .catch((err) => {
    console.log('Database connection error:', err.message);
    process.exit(1);
  })