const {
  ValidationError,
  DocumentNotFoundError,
  CastError,
} = require('mongoose').Error;

const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  CONFLICT_ERROR,
} = require('../utils/constants');

const UnauthorizedError = require('../errors/unauthorizedError');
const AccessDeniedError = require('../errors/accessDeniedError');
const NotFoundError = require('../errors/notFoundError');

module.exports = ((err, req, res, next) => {
  if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode).send({
      message: err.message,
    });
  }
  if (err instanceof AccessDeniedError) {
    return res.status(err.statusCode).send({
      message: err.message,
    });
  }
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).send({
      message: err.message,
    });
  }
  if (err instanceof ValidationError) {
    const errorMessage = Object.values(err.errors).map((error) => error.message).join(' ');
    return res.status(BAD_REQUEST_ERROR).send({
      message: `Incorrect data sent. ${errorMessage}`,
    });
  }
  if (err instanceof DocumentNotFoundError) {
    return res.status(NOT_FOUND_ERROR).send({
      message: `User with id was not found: ${err.value}`,
    });
  }
  if (err instanceof CastError) {
    return res.status(BAD_REQUEST_ERROR).send({
      message: 'Incorrect data sent.',
    });
  }
  if (err.code === 11000) {
    return res.status(CONFLICT_ERROR).send({
      message: 'User with this email is already registered.',
    });
  }
  res.status(DEFAULT_ERROR).send({
    message: 'An error occurred on the server.',
  });
  return next();
});
