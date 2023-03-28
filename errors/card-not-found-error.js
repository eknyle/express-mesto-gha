class CardNotFound extends Error {
  constructor({ addMessage = '' }) {
    super();
    this.message = `Карточка не найдена ${addMessage}`;
    this.name = 'CardNotFound';
    this.status = 404;
  }
}

module.exports = CardNotFound;
