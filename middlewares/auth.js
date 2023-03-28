const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError());
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

    return next(new UnauthorizedError());
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
