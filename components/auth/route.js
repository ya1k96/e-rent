const express = require('express');
const router = express.Router();
const validation = require('./validation');
const {login, register} = require('./index');

router.post('/login', validation.login, login);
router.post('/register', validation.register, register);

module.exports = router;
