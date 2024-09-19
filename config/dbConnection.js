const mongoose = require('mongoose');

const dbConnect = async () => await mongoose.connect(process.env.CONNECTION_STRING);

module.exports = dbConnect;