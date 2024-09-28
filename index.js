const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const dbConnect = require('./config/dbConnection');

// require('./models/configModel').findOne({_id: require('./config/systemConfig').configId}).then(f => {
//   require('./models/configModel').findOneAndUpdate({_id: f._id}, {categories: [...f.categories, 'Arduino',]}, {new: true}).then(d=>console.log(d))
// })

const app = express();
const port = 5000;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use(require('./routes/homeRoutes'));
app.use('/files', require('./routes/viewFileRoutes'));
app.use('/files', require('./routes/uploadRoutes'));
app.use('/auth', require('./routes/loginRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/config', require('./routes/configRoutes'));

// only run the server when connected to database
dbConnect().then((res) => {
  console.log('Database connected:', res.connection.name);
  app.listen(port, () => console.log(`Server running on port ${port}`))})
  .catch((err) => {
    console.log('Database connection error:', err.message);
    process.exit(1);
  })