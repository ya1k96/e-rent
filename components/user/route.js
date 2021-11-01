const express = require('express');
const router = express.Router();
const validation = require('./validation');
const Controller = require('./index');
const responses = require('../../network/response');
const {RESPONSE_OK} = require('../../utils/constants');

const login = (req, res, next) => {      
    Controller.login(req)
    .then((token) => {
      responses.success(req, res, token, RESPONSE_OK);
    })
    .catch(next)          
  }
  
  const register = async (req, res, next) => {   
    Controller.register(req)
    .then(async newUser => {
      const data = {email: newUser.email, _id: newUser._id}
      responses.success(req, res, data, RESPONSE_OK);
      
     //TODO: Pasar a un servicio
    // let urlConfirmation = `${req.protocol}${req.get('host')}/userVerification?token=${newUser.token_confirmation}&email=${newUser.email}`;
      
    // let bodyEmail = `<p>Hola! Por favor confirma tu correo haciendo click en el siguiente link</p>
    // <a href="${urlConfirmation}" >Confirmar mi correo</a>`;
    // await sendEmail("Confirma tu correo", "Confirma tu correo", newUser.email, bodyEmail);
   })
   .catch(next)          
 }

 const verifyToken = (req) => {
     Controller.verifytoken(req)
     .then(data => {
        responses.success(req, res, data, RESPONSE_OK);
     })
     .catch(next);
 }


router.post('/login', validation.login, login);
router.post('/register', validation.register, register);
router.get('/verify_token', verifyToken);

module.exports = router;
