class DuplicateError extends Error {
  constructor(addMessage = '') {
    super();
    this.message = `Пользователь с такими данными уже существует ${addMessage}`;
    this.name = 'DuplicateError';
    this.status = 409;
    this.statusCode = 409;
  }
}

module.exports = DuplicateError;
