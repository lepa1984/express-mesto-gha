const { AUTHORIZATION_ERROR } = require('../utils/constants');

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = AUTHORIZATION_ERROR;
  }
}

module.exports = AuthError;
