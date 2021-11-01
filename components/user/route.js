const express = require('express');
const router = express.Router();
const validation = require('./validation');
const Controller = require('./index');
const { validationResult } = require('express-validator');
const responses = require('../../network/response');
const {BAD_REQUEST_ERROR, RESPONSE_OK} = require('../../utils/constants');

const login = (req, res, next) => {      
    const errs = validationResult(req);
    console.log(errs.array())
    if (!errs.isEmpty()) {
      const messageErrors = errs.array()
      .map((err) => {
        return {[err.param]: err.msg};
      });
      return responses.error(req, res, messageErrors, BAD_REQUEST_ERROR)                         
    }

    const email = req.body.email;
    const password = req.body.password;

    Controller.login(email, password)
    .then((token) => {
      responses.success(req, res, token, RESPONSE_OK);
    })
    .catch(next)          
}
// const register = (req, res, next) => {
//     try {
//         await sendEmail("Confirma tu correo", "Confirma tu correo", email, bodyEmail);
//     } catch (error) {
//         next(error);        
//     }
// }
// const verifyToken = (req, res, next) => {
//     try {
        
//     } catch (error) {
//         next(error);
//     }
// }


router.post('/login', validation.login, login);

// app.route('/api/register')
// .post(middlewares.login, login);

// app.get('/api/verifyToken', verifyToken)

module.exports = router;
