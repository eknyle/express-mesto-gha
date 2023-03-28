class Forbidden extends Error {
  constructor(addMessage = '') {
    super();
    this.message = `Доступ запрещен ${addMessage}`;
    this.name = 'Forbidden';
    this.status = 403;
    this.statusCode = 403;
  }
}

module.exports = Forbidden;
