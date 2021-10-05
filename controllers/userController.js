const md5 = require('md5');
const usersModel = require('../models/user');
const contractModel = require('../models/contract');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const sendEmail = require('../functions/email/sendEmail');

require('dotenv').config();
const secret = process.env.SECRET;

  module.exports = (app) => {  
    app.route('/api/login')    
    .post( 
      check('password')
      .notEmpty()
      .withMessage('Ingresa una contraseña'),      
      check('email')
      .isEmail()
      .withMessage('Correo invalido'),
      check('email')
      .notEmpty()
      .withMessage('Ingresa tu correo'), async (req, res) => {

      const email = req.body.email;
      const password = req.body.password;
      let user = await usersModel.findOne({email}).populate('user_role');

      if(!user) {
        return res.status(400).json({msg: 'Este usuario no esta registado'})
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if(user) {  
        if(!user.confirmed) {
          return res.status(400).json({msg: 'Debes confirmar tu correo para poder ingresar'})
        } 

        if( user.password === md5(password) ) {
          const publicUser = {
            email: user.email,
            name: user.name,
            role: user.user_role.type        
          }
          let token = jwt.sign(publicUser, secret, { expiresIn: '2 days'});

          return res.json({ token, publicUser})
        } else {
          return res.status(400).json({              
              msg: 'Contraseña o Correo incorrectos.'
            }
          )
        }
      }

    });
    app.route('/api/register')
    .post( 
      /** Validacion de usuario **/
      check('password')
      .isLength({ min: 5 })
      .withMessage('Tu contraseña debe contener al menos 5 caracteres.'),
      check('password')
      .notEmpty()
      .withMessage('Ingresa una contraseña'),
      check('email').custom(async value => {
        let user = await usersModel.findOne({email: value}) ;
        if (user) {
          return Promise.reject('Este correo esta en uso');
        }
      }),
      check('email')
      .isEmail()
      .withMessage('Ingresa un correo valido'),
      check('email')
      .notEmpty()
      .withMessage('Ingresa un correo'),
      check('userId').custom(async value => {
        let contract = contractModel.findById(value);
        if (!contract) {
          return Promise.reject('El codigo de usuario no existe. Contacta con tu administrador.');
        }
      }),
      check('userId')
      .notEmpty()
      .withMessage('Ingresa tu Nro de usuario'), async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const idContract = req.body.userId;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.errors[0].msg });
    }

    const contract = await contractModel.findById(idContract);        
    if(!contract) {
      return res.status(400)
      .json({msg: 'Ha ocurrido un error. Intenta nuevamente mas tarde.'})
    }

    const newUser = await usersModel({email, password: md5(password)}).save();

    if(newUser) {
      contract.user = newUser;
      newUser.contract_id = contract._id;
      newUser.name = contract.name;
                
      Promise.all([newUser.save(), contract.save()])
      .then( async () => await sendEmail("Confirma tu correo", "Confirma tu correo", email, bodyEmail) )
      .catch(() => res.json({ok: true, msg: 'Usuario creado con exito.'}));      

      let urlConfirmation = `${req.protocol}://${req.get('host')}/userVerification?token=${newUser.token_confirmation}&email=${email}`;
      
      let bodyEmail = `<p>Hola! Por favor confirma tu correo haciendo click en el siguiente link</p>
      <a href="${urlConfirmation}" >Confirmar mi correo</a>`;          

      return res.json({msg: 'Usuario creado con exito.'})
    }

    return res.status(400).json({msg: 'Ha ocurrido un error, intenta nuevamente mas tarde.'})
  });

  app.get('/api/verifyToken', async (req, res) => {
    const token = req.query.token;  
    jwt.verify(token, secret, function(err, decoded) {
        if(err) {
            return res.status(400).json({msg: "Token invalido"});
        } else {
          return res.json(decoded);
        }
        
    });
  });
}
