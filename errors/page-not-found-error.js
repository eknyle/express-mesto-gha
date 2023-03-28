class PageNotFoundError extends Error {
  constructor() {
    super();
    this.message = 'Страница по указанному маршруту не найдена';
    this.name = 'PageNotFoundError';
    this.status = 404;
    this.statusCode = 404;
  }
}
module.exports = PageNotFoundError;
