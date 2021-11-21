const md5 = require('md5');
const usersModel = require('./model');
const jwt = require('jsonwebtoken');
const { BAD_REQUEST_ERROR, BAD_GATEWAY, RESPONSE_OK } = require('../../utils/constants');
const {SECRET} = require('../../config/development');
const { validationResult } = require('express-validator');
const { CONFIRMATION_REQUERID, BAD_CREDENTIALS, DEFAULT_MESSAGE } = require('../../utils/messagesConstants');
const responses = require('../../network/response');

  module.exports = {  
    login: async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responses.success(req, res, getErrors(errors), BAD_REQUEST_ERROR);
      }
      
      const email = req.body.email;
      const password = req.body.password;
      
      let user = await usersModel.findOne({email});             
      if(user) {  
        if(!user.confirmed) {
          const error = {error: CONFIRMATION_REQUERID}
          return responses.error(req, res, error, BAD_REQUEST_ERROR);
        } 

        if( user.password === md5(password) ) {
          //TODO: El rol debe provenir del usuario
          const publicUser = {
            email: user.email,
            name: user.name,
            role: "admin"     
          }
          const token = jwt.sign(publicUser, SECRET, { expiresIn: '2 days'});
          req.token = token;
          responses.success(req,res, {token, user: publicUser}, RESPONSE_OK);
        } else {
          return responses.error(req,res,{error: BAD_CREDENTIALS}, BAD_REQUEST_ERROR);
        }
      }      
    },
  
    register: (req, res) =>{      
        const email = req.body.email;
        const password = req.body.password;
        //const idContract = req.body.userId;
    
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return responses.error(req, res, getErrors(errors), BAD_REQUEST_ERROR);
        }
    
        usersModel.create({email, password: md5(password)})
        .then(newUser => responses.success(req,res, {}, RESPONSE_OK))
        .catch(err => {
          return responses.error(req, res, {error: DEFAULT_MESSAGE}, BAD_GATEWAY);
        });                
    }
}
