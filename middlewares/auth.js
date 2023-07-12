const jwt = require('jsonwebtoken');
const { AUTHORIZATION_ERROR } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res
      .status(AUTHORIZATION_ERROR)
      .send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'unique-secret-key');
  } catch (err) {
    return res
      .status(AUTHORIZATION_ERROR)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
