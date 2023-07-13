const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const ConflictError = require('../errors/ConflictError');
const AuthError = require('../errors/AuthError');

const createUser = (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
    )
    .then(() => {
      res.status(201).send({ name, about, avatar, email });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        // eslint-disable-next-line no-undef
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя'
          )
        );
      } else if (error.code === 11000) {
        // eslint-disable-next-line no-undef
        next(
          new ConflictError('Пользователь с таким email уже зарегистрирован')
        );
      }
      return next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .orFail(() => next(new AuthError('Неправильные почта или пароль')))
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthError('Неправильные почта или пароль');
        }
        const token = jwt.sign({ id: user._id }, 'unique-secret-key', {
          expiresIn: '7d',
        });
        return res.send({ token });
      });
    })
    .catch((error) => {
      next(error);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      next(error);
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
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
const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
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

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
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
        throw new NotFoundError('Нет пользователя с таким id');
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
