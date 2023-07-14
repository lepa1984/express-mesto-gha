const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, 'unique-secret-key');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};
