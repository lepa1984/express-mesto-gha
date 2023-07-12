const BAD_REQUEST_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const INTERNAL_SERVER_ERROR = 500;
const AUTHORIZATION_ERROR = 401;
const FORBIDDEN_ERROR = 403;
const CONFLICT_ERROR = 409;
const regexUrl =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/;

module.exports = {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  AUTHORIZATION_ERROR,
  regexUrl,
  FORBIDDEN_ERROR,
  CONFLICT_ERROR,
};
