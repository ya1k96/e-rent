const { check, validationResult } = require('express-validator');
const { BAD_REQUEST_ERROR } = require('../../utils/constants');
const responses = require('../../network/response');

module.exports = {
    validContract: async (req, res, next) => {
        await check('name')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .run(req),         
        await check('lastname')
        .notEmpty()
        .withMessage('El apellido es requerido')
        .run(req), 
        await check('price')
        .notEmpty().bail()
        .withMessage('El monto es requerido')
        .isNumeric()
        .withMessage('El monto debe ser numerico')
        .run(req),  
        await check('increment_month')
        .notEmpty()
        .withMessage('Establece el periodo de incremento')
        .run(req), 
        await check('increment_porc')
        .notEmpty()
        .withMessage('Establece el porcentaje de incremento')
        .run(req),
        /** TODO: Tenemos que traer el mes minimo de un modelo */
        await check('months')
        .custom(async value => {
          if (value < 12) {
            return Promise.reject('El periodo del contrato minimo es de 12 meses');
          }
        })
        .run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return responses.error(req, res, errors.array(), BAD_REQUEST_ERROR);            
        }
        return next();
    }      
}