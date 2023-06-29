const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(500).send({
        message: 'Не удалось получить список пользователей',
      });
    });
};
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Id пользователя не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
          res.status(400).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(500).send({
          message: 'Ошибка получения данных пользователя',
        });
      }
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status('400').send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      res.status(500).send({
        message: 'Ошибка при создании пользователя',
      });
    });
};
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: 'Информация о пользователе не найдена',
        });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка обновления данных пользователя' });
    });
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: 'Пользователь по указанному ID не найден',
        });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status('400').send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка обновления аватара пользователя' });
    });
};
