class Forbidden extends Error {
  constructor() {
    super();
    this.message = 'Доступ запрещен';
    this.name = 'Forbidden';
    this.status = 403;
    this.statusCode = 403;
  }
}

module.exports = Forbidden;
