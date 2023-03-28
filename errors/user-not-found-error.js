class UserNotFound extends Error {
  constructor({ addMessage = '' }) {
    super();
    this.message = `Пользователь не найден ${addMessage}`;
    this.name = 'UserNotFound';
    this.status = 404;
    this.statusCode = 404;
  }
}

module.exports = UserNotFound;
