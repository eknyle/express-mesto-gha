class UserNotFound extends Error {
  constructor() {
    super();
    this.message = 'Пользователь не найден';
    this.name = 'UserNotFound';
    this.status = 404;
    this.statusCode = 404;
  }
}

module.exports = UserNotFound;
