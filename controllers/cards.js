const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const NotUserError = require('../errors/NotUser');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
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

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    }) // eslint-disable-next-line no-undef
    .catch(next);
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        // eslint-disable-next-line no-undef
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      if (req.user.id !== card.owner.toString()) {
        // eslint-disable-next-line no-undef
        next(new NotUserError('Нельзя удалять чужие карточки.'));
      } else {
        Card.deleteOne(card).then(() =>
          res.send({ message: 'Карточка удалена.' })
        );
      }
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError('Карточка не найдена.'))
    .then((card) => res.send(card))
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        // eslint-disable-next-line no-undef
        next(new NotFoundError('Карточка не найдена.'));
      }
      return res.send({ card, message: 'Лайк удален' });
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
