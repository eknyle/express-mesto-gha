class ValidationError extends Error {
  constructor(addMessage = '') {
    super();
    this.message = `Переданы некорректные данные ${addMessage}`;
    this.name = 'ValidationError';
    this.status = 400;
    this.statusCode = 400;
  }
}

module.exports = ValidationError;
