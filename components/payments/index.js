const {moment} = require('../../utils/momentEs');
const err = require('../../utils/error');
const { BAD_REQUEST_ERROR, BAD_GATEWAY } = require('../../utils/constants');
const { DEFAULT_MESSAGE } = require('../../utils/messagesConstants');
const {generateInvoice}= require('../../functions/invoicePDF/index');

module.exports = {
    payInvoice: async (req) => new Promise((resolve, reject) => {
        //id de la factura, para generar el recibo.
        const id = req.params.id;
  
        let invoice = await invoiceModel.findById(id);
        const expirationMoment = moment(invoice.expiration);
        let expiredTimes = expirationMoment.diff(new Date(), 'days');

        let interest = 0;

        if(invoice.payed) {
          return reject(err({msg: "La factura ya esta pagada."}, BAD_REQUEST_ERROR))
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
        .then(payment => {
            invoice.payed = true;
            invoice.payment = payment._id;
            invoice.save()            
            .catch(error => reject(err({error: DEFAULT_MESSAGE}, BAD_REQUEST_ERROR)))    

            resolve(payment);
        })
        .catch(error => reject(err(error)))    

      }),

      generateInvoicePayed: (req) => new Promise((resolve, reject) => {
        const id_invoice = req.params.id_payment;
        const id_payment = req.params.id_invoice;
        const invoice = await invoiceModel.findById(id_invoice)
        .populate('contract_id')
        .populate('payment');

        if(!invoice || !invoice.payment || invoice.payment._id != id_payment) {
            return res.status(400).json({msg: genericalError});
        }
        
        generateInvoice(invoices, id_payment)
        .then(data => resolve(data))
        .catch(err({error: DEFAULT_MESSAGE}, BAD_REQUEST_ERROR));
    })
}