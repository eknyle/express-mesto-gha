class DuplicateError extends Error {
  constructor() {
    super();
    this.message = 'Пользователь с такими данными уже существует';
    this.name = 'DuplicateError';
    this.status = 409;
    this.statusCode = 409;
  }
}

module.exports = DuplicateError;
