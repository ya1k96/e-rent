const express = require('express');
const router = express.Router();
const validation = require('./validation');
const {login, register} = require('./index');
/**
 * @swagger
 * /auth/login:
 *  post:
 *   description: Logearse en la aplicacion
 *   responses: 
 *    '200':
 *          {token:""}
 *    '400':
 *      description:
 *          Bad credentials
 */
router.post('/login', validation.login, login);
/**
 * @swagger
 * /auth/register:
 *  post:
 *   description: Registrarse en la app
 *   responses: 
 *    '200':
 *          {token:""}
 *    '400':
 *      description:
 *          Bad credentials
 */
router.post('/register', validation.register, register);

module.exports = router;
