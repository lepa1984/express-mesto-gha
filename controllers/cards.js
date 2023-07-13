const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const NotUserError = require('../errors/NotUser');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        // eslint-disable-next-line no-undef
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки.'
          )
        );
      } else {
        // eslint-disable-next-line no-undef
        next(error);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    }) // eslint-disable-next-line no-undef
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена.');
      } else if (req.user.id.toString() !== card.owner.toString()) {
        throw new NotUserError('Нельзя удалять чужие карточки.');
      }
      return res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        // eslint-disable-next-line no-undef
        next(
          new BadRequestError(
            'Переданы некорректные данные при удалении карточки'
          )
        );
      } else {
        // eslint-disable-next-line no-undef
        next(error);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена.');
      }
      return res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        // eslint-disable-next-line no-undef
        next(new BadRequestError('Переданы некорректные данные для лайка'));
      } else {
        // eslint-disable-next-line no-undef
        next(error);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена.');
      }
      return res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        // eslint-disable-next-line no-undef
        next(
          new BadRequestError('Переданы некорректные данные при удалении лайка')
        );
      } else {
        // eslint-disable-next-line no-undef
        next(error);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
