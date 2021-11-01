const md5 = require('md5');
const usersModel = require('../user/model');
// const contractModel = require('../contract/contract');
const jwt = require('jsonwebtoken');
// const sendEmail = require('../functions/email/sendEmail');
const err = require('../../utils/error');
const {SECRET} = require('../../config/development');
  module.exports = {  
    login: (email, password) => new Promise(async (resolve, reject) => {
      {   
        let user = await usersModel.findOne({email}).populate('user_role');             
        if(user) {  
          if(!user.confirmed) {
            reject(err('Debes confirmar tu correo para poder ingresar', 401))
          } 
  
          if( user.password === md5(password) ) {
            const publicUser = {
              email: user.email,
              name: user.name,
              role: "admin"// Modificar luego      
            }
            resolve(jwt.sign(publicUser, SECRET, { expiresIn: '2 days'}));
            
          } else {
            reject(err('Contraseña o Correo incorrectos.', 401));
          }
        }
      }
    }),
  
  //   register: () => {
  //     const email = req.body.email;
  //     const password = req.body.password;
  //     const idContract = req.body.userId;
  
  //     const errors = validationResult(req);
  
  //     if (!errors.isEmpty()) {
  //       return res.status(400).json({ msg: errors.errors[0].msg });
  //     }
  
  //     const contract = await contractModel.findById(idContract);        
  //     if(!contract) {
  //       return res.status(400)
  //       .json({msg: 'Ha ocurrido un error. Intenta nuevamente mas tarde.'})
  //     }
  
  //     const newUser = await usersModel({email, password: md5(password)}).save();
  
  //     if(newUser) {
  //       contract.user = newUser;
  //       newUser.contract_id = contract._id;
  //       newUser.name = contract.name;
                  
  //       Promise.all([newUser.save(), contract.save()])
  //       .then( () => {})
  //       .catch((err) => res.status(400).json({msg: 'Ha ocurrido un error.', err}));      
  
  //       let urlConfirmation = `${req.protocol}://${req.get('host')}/userVerification?token=${newUser.token_confirmation}&email=${email}`;
        
  //       let bodyEmail = `<p>Hola! Por favor confirma tu correo haciendo click en el siguiente link</p>
  //       <a href="${urlConfirmation}" >Confirmar mi correo</a>`;          
        
  //       return true;   
  //     }  
      
  //     return new Error('Ha ocurrido un error. Intenta nuevamente mas tarde.');;
      
  // },

  // verifyToken: () => {
  //   const token = req.query.token;  
  //   jwt.verify(token, secret, function(err, decoded) {
  //       if(err) {
  //           return res.status(400).json({msg: "Token invalido"});
  //       } else {
  //         return res.json(decoded);
  //       }
        
  //   });
  // }
}
