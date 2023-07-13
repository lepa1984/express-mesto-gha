const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/AuthError');

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
    )
    .then(() => {
      res.send({
        name,
        about,
        email,
        avatar,
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        // eslint-disable-next-line no-undef
        next(
          new ConflictError('Пользователь с таким email уже зарегистрирован')
        );
        return;
      }
      if (error.name === 'ValidationError') {
        // eslint-disable-next-line no-undef
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя'
          )
        );
      } else {
        // eslint-disable-next-line no-undef
        next(error);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неправильные почта или пароль');
        }
        const token = jwt.sign({ id: user._id }, 'unique-secret-key', {
          expiresIn: '7d',
        });
        return res.status(200).send({ token });
      });
    })
    .catch(next);
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    // eslint-disable-next-line no-undef
    .catch((error) => next(error));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        // eslint-disable-next-line no-undef
        return next(new NotFoundError('Нет пользователя с таким id'));
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        // eslint-disable-next-line no-undef
        next(new BadRequestError('Некорректные данные пользователя'));
      } else {
        // eslint-disable-next-line no-undef
        next(error);
      }
    });
};
const updateUserInfo = (req, res) => {
  const { name, about, email, password } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about, email, password },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        // eslint-disable-next-line no-undef
        return next(new NotFoundError('Нет пользователя с таким id'));
      }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        // eslint-disable-next-line no-undef
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля'
          )
        );
      } else {
        // eslint-disable-next-line no-undef
        next(error);
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        // eslint-disable-next-line no-undef
        return next(new NotFoundError('Нет пользователя с таким id'));
      }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        // eslint-disable-next-line no-undef
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля'
          )
        );
      } else {
        // eslint-disable-next-line no-undef
        next(error);
      }
    });
};
const getUserInfo = (req, res, next) => {
  const { userId } = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        // eslint-disable-next-line no-undef
        return next(new NotFoundError('Нет пользователя с таким id'));
      }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        // eslint-disable-next-line no-undef
        next(new BadRequestError('Некорректные данные пользователя'));
      } else {
        // eslint-disable-next-line no-undef
        next(error);
      }
    });
};
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
  login,
  getUserInfo,
};
