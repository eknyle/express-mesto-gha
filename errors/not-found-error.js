class NotFoundError extends Error {
  constructor() {
    super();
    this.message = 'Информация не найдена';
    this.name = 'NotFoundError';
    this.status = 404;
    this.statusCode = 404;
  }
}
module.exports = NotFoundError;
