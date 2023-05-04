const { ValidationError, DocumentNotFoundError, CastError } = require('mongoose').Error;

const CREATED_CODE = 201;
const BAD_REQUEST_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const DEFAULT_ERROR = 500;

const handleErrors = (err, res) => {
  if (err instanceof ValidationError) {
    const errorMessage = Object.values(err.errors)
      .map((error) => error.message)
      .join(' ');
    return res.status(BAD_REQUEST_ERROR).send({
      message: `Invalid data sent. ${errorMessage}`,
    });
  }
  if (err instanceof DocumentNotFoundError) {
    return res.status(NOT_FOUND_ERROR).send({
      message: 'No document with ID was found in the database',
    });
  }
  if (err instanceof CastError) {
    return res.status(BAD_REQUEST_ERROR).send({
      message: `Invalid ID passed: ${err.value}`,
    });
  }
  return res.status(DEFAULT_ERROR).send({
    message: `Unknown error has occurred ${err.name}: ${err.message}`,
  });
};

module.exports = {
  CREATED_CODE,
  NOT_FOUND_ERROR,
  handleErrors,
};
