const Card = require('../models/card');
const NotFoundError = require('../errors/notfound');
const BadRequestError = require('../errors/badrequest');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Введите корректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findOneAndDelete({ _id: req.params.cardId })
    .orFail(() => new NotFoundError('Запрашиваемый id не найден'))
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        next(new NotFoundError('Id не совпадают'));
      }
    })

    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Введите корректные данные'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => new NotFoundError('Запрашиваемый id не найден'))
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError('Введите корректные данные'));
    } else {
      next(err);
    }
  });

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => new NotFoundError('Запрашиваемый id не найден'))
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError('Введите корректные данные'));
    } else {
      next(err);
    }
  });

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
