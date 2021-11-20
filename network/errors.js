const { BAD_REQUEST_ERROR } = require('../utils/constants');
const { DEFAULT_MESSAGE } = require('../utils/messagesConstants');
const response = require('./response');

function errors(err, req, res, next) {
    console.error('[error]', err);

    const message = err.message || DEFAULT_MESSAGE;
    const status = err.statusCode || BAD_REQUEST_ERROR;

    response.error(req, res, message, status);
}

module.exports = errors;
