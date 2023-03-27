
const errors = require('./error-codes');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || errors.SERVER_ERROR_CODE;

  const message = statusCode === errors.SERVER_ERROR_CODE ? `${errors.SERVER_ERROR_MESSAGE} ${err.message}` : err.message;
  if (statusCode === errors.SERVER_ERROR_CODE) {
    res.status(statusCode).send({ message });
  }

  next();
};

module.exports = errorHandler;
