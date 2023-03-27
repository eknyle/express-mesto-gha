const errors = require('./error-codes');

const errorHandler = (err, req, res, next) => {
  const statusCode = errors.SERVER_ERROR_CODE;

  const message = `${errors.SERVER_ERROR_MESSAGE} ${err.message}`;
  res.status(statusCode).send({ message });
  next();
};

module.exports = errorHandler;