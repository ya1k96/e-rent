const router = require('express').Router();
const {payInvoice, generateInvoicePayed} = require('./index');

router.post('/create/:id', payInvoice);
router.post('/:id_invoice/:id_payment', generateInvoicePayed);

module.exports = router;