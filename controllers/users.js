const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
      return  res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
       return res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
     return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
       return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
     return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
       return res.status(400).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
       return res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
       return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      }
     return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
       return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
       return res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
       return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      }
     return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
     return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
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
