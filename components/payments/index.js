const moment = require('moment');
const { BAD_REQUEST_ERROR, BAD_GATEWAY, RESPONSE_OK } = require('../../utils/constants');
const { DEFAULT_MESSAGE, INVOICES_PAYED_ALRIGHT } = require('../../utils/messagesConstants');
const {generateInvoice}= require('../../functions/invoicePDF/index');
const invoiceModel = require('../invoices/model');
const paymentsModel = require('../payments/model');
const responses = require('../../network/response');

const payInvoice = async (req, res) => {
    //id de la factura, para generar el recibo.
    const id = req.params.id;

    let invoice = await invoiceModel.findById(id)
    .populate('contract_id');
    const expirationMoment = moment(invoice.expiration);
    let expiredTimes = expirationMoment.diff(new Date(), 'days');

    let interest = 0;

    if(invoice.payed) {
        return responses.error(req, res, INVOICES_PAYED_ALRIGHT, BAD_REQUEST_ERROR)
    }

    if( expiredTimes <= 0 ) {
        interest = (-expiredTimes) * (invoice.total * 0.01);
    }

    paymentsModel.create({
        month: invoice.month,
        price: invoice.total,
        total: interest + invoice.total,
        interest 
    })
    .then(async payment => {
        invoice.payed = true;
        invoice.payment = payment._id;
        await invoice.save();                      
        generateInvoice(invoice, payment)
        .then(data => responses.success(req, res, data, RESPONSE_OK))
        .catch(err => {
            return responses.error(req, res, DEFAULT_MESSAGE, BAD_REQUEST_ERROR);            
        });
    })
    .catch(error => responses.error(req, res, DEFAULT_MESSAGE, BAD_REQUEST_ERROR))      

  }

module.exports = {
    payInvoice
}