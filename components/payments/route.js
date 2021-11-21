const router = require('express').Router();
const {payInvoice, generateInvoicePayed} = require('./index');

router.post('payments/create/:id', payInvoice);
router.post('payments/:id_invoice/:id_payment', generateInvoicePayed);

module.exports = router;