const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const jwtToken = req.cookies.token;
  let payload;
  try {
    payload = jwt.verify(jwtToken, 'unique-secret-key');
  } catch (err) {
    return next(new AuthError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
