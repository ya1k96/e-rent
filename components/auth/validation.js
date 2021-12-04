const usersModel = require('./model');
const { check } = require('express-validator');

module.exports = {
    login: [
        check('password')        
        .notEmpty()
        .withMessage('Ingresa una contraseña'),
        check('email')
        .notEmpty().bail()
        .withMessage('Ingresa tu correo')
        .isEmail().bail()
        .withMessage('Correo invalido')
        .custom(async value => {
            let user = await usersModel.findOne({email: value}) ;
            if (!user) {
            return Promise.reject('Usuario no registrado');
            }
        })
    ],
    register: [
        check('password')
      .notEmpty().bail()
      .withMessage('Ingresa una contraseña')
      .isLength({ min: 5 })
      .withMessage('Tu contraseña debe contener al menos 5 caracteres.'),
      check('email')
      .notEmpty().bail()
      .withMessage('Ingresa un correo')
      .isEmail().bail()
      .withMessage('Ingresa un correo valido')
      .custom(async value => {
        let user = await usersModel.findOne({email: value});
        console.log(user)
        if (user) {
          return Promise.reject('Este correo esta en uso');
        }
      })      
    ]
}