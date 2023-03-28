const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = statusCode === 500
    ? 'Внутренняя ошибка сервера' : err.message;
  if (statusCode === 500) {
    res.status(statusCode).send({ message });
  }
  next();
};

module.exports = errorHandler;
