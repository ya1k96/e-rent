const router = require('express').Router();
const {payInvoice} = require('./index');

router.get('/create/:id', payInvoice);

module.exports = router;