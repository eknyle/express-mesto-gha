const jwt = require('jsonwebtoken');
const errors = require('../errors/error-codes');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(errors.UNAUTHORIZED_ERROR_CODE)
      .send({ message: errors.UNAUTHORIZED_ERROR_MESSAGE });
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  // верифицируем токен
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, '29ea2afd00fdec957d31555f5aa99601b10fd99c29928f242328168a78eae737');
  } catch (err) {
    // отправим ошибку, если не получилось
    console.log('authorization '+err.message);
    return res
      .status(errors.UNAUTHORIZED_ERROR_CODE)
      .send({ message: errors.UNAUTHORIZED_ERROR_MESSAGE });
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};