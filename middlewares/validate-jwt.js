const jwt = require('jsonwebtoken');
const config = require('../config/development');
const response = require('../network/response');
const { FORBIDDEN } = require('../utils/constants');
const { EMPTY_TOKEN } = require('../utils/messagesConstants');

module.exports = {
    validateJwt: async (req, res, next) => {
        const token = req.token;

        if(!token) {
            response.error(req, res, EMPTY_TOKEN, FORBIDDEN);            
        }
        
        const result = await jwt.verify(token, config.SECRET);
        
        if(!result) {
            response.error(req, res, EMPTY_TOKEN, FORBIDDEN);            
        }

        next();
    }
}