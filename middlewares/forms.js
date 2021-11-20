const { check } = require('express-validator');
const { BAD_REQUEST_ERROR } = require('../../utils/constants');

module.exports = {
    notEmptyId: async (req, res, next) => {
        await check('id')
        .notEmpty().withMessage('El id es requerido')
        .run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return responses.error(req, res, errors.array(), BAD_REQUEST_ERROR);            
        }
        return next();
    }  
}