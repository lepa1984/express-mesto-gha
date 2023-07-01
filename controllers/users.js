const User = require('../models/user');
const { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR } = require('../utils/constants');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
};
