const {moment} = require('../../utils/momentEs');
const { BAD_REQUEST_ERROR, BAD_GATEWAY } = require('../../utils/constants');
const { DEFAULT_MESSAGE, INVOICES_PAYED_ALRIGHT } = require('../../utils/messagesConstants');
const {generateInvoice}= require('../../functions/invoicePDF/index');

module.exports = {
    payInvoice: async (req, res) => {
        //id de la factura, para generar el recibo.
        const id = req.params.id;
  
        let invoice = await invoiceModel.findById(id);
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

            return responses.success(req, res, payment, RESPONSE_OK);
        })
        .catch(error => responses.error(req, res, DEFAULT_MESSAGE, BAD_REQUEST_ERROR))    

      },

      generateInvoicePayed: (req, res) => {
        const id_invoice = req.params.id_payment;
        const id_payment = req.params.id_invoice;
        const invoice = await invoiceModel.findById(id_invoice)
        .populate('contract_id')
        .populate('payment');

        if(!invoice || !invoice.payment || invoice.payment._id != id_payment) {
            return responses.error(req, res, DEFAULT_MESSAGE, BAD_REQUEST_ERROR);
        }        
        
        generateInvoice(invoices, id_payment)
        .then(data => responses.success(req, res, data, RESPONSE_OK))
        .catch(err => {
            return responses.error(req, res, DEFAULT_MESSAGE, BAD_REQUEST_ERROR);            
        });
    }
}