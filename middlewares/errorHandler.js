const errorHandler = (err, req, res, next) => {
  if (err) console.log('Error:', err);
  next();
}

module.exports = errorHandler;