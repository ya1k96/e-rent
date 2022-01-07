const router = require('express').Router();
const authRoute = require('./auth/route');
const usersRoute = require('./users/route');
const contractsRoute = require('./contracts/route');
const paymentsRoute = require('./payments/route');
const invoicesRoute = require('./invoices/route');
const {validateJwt} = require('../middlewares/validate-jwt');

router.use('/auth', authRoute);
router.use('/users', [validateJwt], usersRoute);
router.use('/contracts', [validateJwt], contractsRoute);
router.use('/invoices', [validateJwt], invoicesRoute);
router.use('/payments', [validateJwt], paymentsRoute);

module.exports = router;