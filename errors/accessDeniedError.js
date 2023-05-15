const { ACCESS_DENIED_ERROR } = require('../utils/constants');

class AccessDeniedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ACCESS_DENIED_ERROR;
  }
}

module.exports = AccessDeniedError;
