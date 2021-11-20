const router = require('express').Router();
const Controller = require('./index');
const responses = require('../../network/response');

const payInvoice  = (req, res, next) => {
    Controller.payInvoice(req)
    .then(resp => {
      const data = {message: INVOICES_PAYED_OK, _id: resp._id}
      responses.success(req, res, data, RESPONSE_OK);
    })
    .catch(next);
}
const createInvoicePayed  = (req, res, next) => {
    Controller.generateInvoicePayed(req)
    .then(resp => {
      const data = {message: INVOICES_PAYED_OK, _id: resp._id}
      responses.success(req, res, data, RESPONSE_OK);
    })
    .catch(next);
}

router.post('payments/create/:id', payInvoice);
router.post('payments/invoice/:id_invoice/:id_payment', createInvoicePayed);

module.exports = router;