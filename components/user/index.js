const md5 = require('md5');
const usersModel = require('../user/model');
const jwt = require('jsonwebtoken');
const err = require('../../utils/error');
const {SECRET} = require('../../config/development');
const { BAD_REQUEST_ERROR, BAD_GATEWAY } = require('../../utils/constants');
const { validationResult } = require('express-validator');
  //Funcion para obtener los errores de campo mas simple
  const getErrors = (errs) => errs.array()
  .map((err) => {
    return {
      [err.param]: err.msg
    };
  })

  module.exports = {  
    login: (req) => new Promise(async (resolve, reject) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return reject(err(getErrors(errors), BAD_REQUEST_ERROR));
      }

      const email = req.body.email;
      const password = req.body.password;

      let user = await usersModel.findOne({email});             
      if(user) {  
        if(!user.confirmed) {
          reject(err({error: 'Debes confirmar tu correo para poder ingresar'}, BAD_REQUEST_ERROR))
        } 

        if( user.password === md5(password) ) {
          const publicUser = {
            email: user.email,
            name: user.name,
            role: "admin"// Modificar luego      
          }
          resolve({token: jwt.sign(publicUser, SECRET, { expiresIn: '2 days'})});
          
        } else {
          reject(err({error: 'Contraseña o Correo incorrectos.'}, BAD_REQUEST_ERROR));
        }
      }      
    }),
  
    register: (req) => new Promise(async (resolve, reject) => {      
        const email = req.body.email;
        const password = req.body.password;
        //const idContract = req.body.userId;
    
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return reject(err(getErrors(errors), BAD_REQUEST_ERROR));
        }
    
        usersModel.create({email, password: md5(password)})
        .then(newUser => resolve(newUser))
        .catch(err => reject(err({error: 'Ha ocurrido un error. Intenta nuevamente mas tarde.'}, BAD_GATEWAY)));                
    })  
}
