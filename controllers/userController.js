const md5 = require('md5');
const usersModel = require('../models/user');
const contractModel = require('../models/contract');
const rolesModel = require('../models/roles');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const sendVerificationMail = require('../functions/sendVerificationMail');

require('dotenv').config();
const secret = process.env.SECRET;

  module.exports = (app) => {
    app.route('/login')
    .get( async (req, res) => {  
      if(req.session.logged)  return res.redirect('./');
      return res.render('auth/login');
    })
    .post( 
      check('password')
      .notEmpty()
      .withMessage('Ingresa una contraseña'),
      check('email').custom(async value => {
        let user = await usersModel.findOne({email: value}) ;
        if (!user) {
          return Promise.reject('No existe ningun usuario registrado');
        }
      }),
      check('email')
      .isEmail()
      .withMessage('Correo invalido'),
      check('email')
      .notEmpty()
      .withMessage('Ingresa tu correo'),
      async (req, res) => {
      const email = req.body.email;
      const password = req.body.password;

      let user = await usersModel.findOne({email}).populate('user_role');
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ ok: false, errors: errors.array() });
      }

      if(user) {  
        if(!user.confirmed) {
          return res.json({ok: false, msg: 'Debes confirmar tu correo para poder ingresar', code: 4})
        } 

        if( user.password === md5(password) ) {
          console.log(user)
          const publicUser = {
            email: user.email,
            role: user.user_role.type        
          }
          let token = jwt.sign(publicUser, secret, { expiresIn: '2 days'});
          //Definimos la sesion para el usuario
          req.session.token = token;
          req.session.role = user.user_role.type;
          req.session.logged = true;
          req.session.name = user.name;

          return res.json({ok: true, token})
        } else {
          return res.json({ok: false, msg: 'Contraseña o Correo incorrectos.', code: 0})
        }
      }

    });
    app.route('/register')
    .get( (req, res) => {    
      return res.render('auth/register');
    })
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
      .withMessage('Ingresa tu Nro de usuario'),
    async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const idContract = req.body.userId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ ok: false, errors: errors.array() });
    }

    let contract;
    try {
      contract = await contractModel.findById(idContract);        
    } catch(err) {
      return res.json({ok: false, msg: 'Ha ocurrido un error. Intenta nuevamente mas tarde.', code: 2})
    }

    const newUser = await usersModel({email, password: md5(password)}).save();

    if(newUser) {
      contract.user = newUser;
      newUser.contract_id = idContract;
      newUser.name = contract.name;
      await contract.save();
      await newUser.save();
      let urlConfirmation = `${req.protocol}://${req.get('host')}/userVerification?token=${newUser.token_confirmation}&email=${email}`;
      
      await sendVerificationMail(email, urlConfirmation);

      return res.json({ok: true, msg: 'Usuario creado con exito.'})
    }

    return res.json({ok: false, msg: 'Ha ocurrido un error, intenta nuevamente mas tarde.'})
  });

  app.get('/userVerification', async (req, res) => {
    console.log(req.query)
    const token = req.query.token;
    const email = req.query.email;
    const userToVerified = await usersModel.findOne({email});
    let status = {
      ok: false, msg: 'Error', ico: 'error'
    };

    if(!userToVerified) {
      //Mostrar vista de error
    }

    if(!userToVerified.confirmed && userToVerified.token_confirmation == token) {
      userToVerified.confirmed = true;
      await userToVerified.save();

      status = {
        ok: true, class: 'Perfecto!', name: userToVerified.name,
         ico: 'userVerified'
      };

      return res.render('auth/verification', {status});
    }

    return res.render('auth/verification', {status});

  });
}
