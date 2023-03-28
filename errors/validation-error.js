class ValidationError extends Error {
  constructor() {
    super();
    this.message = 'Переданы некорректные данные';
    this.name = 'ValidationError';
    this.status = 400;
    this.statusCode = 400;
  }
}

module.exports = ValidationError;
