class UnauthorizedError extends Error {
  constructor() {
    super();
    this.message = 'Необходима авторизация';
    this.name = 'Unauthorized';
    this.status = 401;
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
