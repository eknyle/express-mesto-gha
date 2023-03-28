class UnauthorizedError extends Error {
  constructor({ addMessage = '' }) {
    super();
    this.message = `Необходима авторизация ${addMessage}`;
    this.name = 'Unauthorized';
    this.status = 401;
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
