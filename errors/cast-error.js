class CastError extends Error {
  constructor(addMessage = '') {
    super();
    this.message = `Передан некорректный ID ${addMessage}`;
    this.name = 'CastError';
    this.status = 404;
  }
}

module.exports = CastError;
