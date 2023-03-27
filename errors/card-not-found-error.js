class CardNotFound extends Error {
  constructor() {
    super();
    this.message = 'Карточка не найдена';
    this.name = 'CardNotFound';
    this.status = 404;
  }
}

module.exports = CardNotFound;
