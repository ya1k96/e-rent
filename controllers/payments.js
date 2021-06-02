const mercadopago = require("mercadopago");
const invoiceModel = require('../models/invoice');
const paymentsModel = require('../models/payment');
const getPDF = require('../functions/invoice');
const moment = require('moment');
const firebase = require('../functions/firebase');
const path = require('path');
const fs = require('fs');
moment.locale('es');

require('dotenv').config();
module.exports = (app) => {
    mercadopago.configurations.setAccessToken(process.env.ACCESS_TOKEN); 
    
    app.post("/payments/create_preference", (req, res) => {
    
        let preference = {
            items: [{
                title: req.body.description,
                unit_price: Number(req.body.price),
                quantity: Number(req.body.quantity),
            }],
            back_urls: {
                "success": "http://localhost:3000/payments/feedback",
                "failure": "http://localhost:3000/payments/feedback",
                "pending": "http://localhost:3000/payments/feedback"
            },
            auto_return: 'approved',
        };
    
        mercadopago.preferences.create(preference)
            .then(function (response) {
                res.json({id :response.body.id})
            }).catch(function (error) {
                console.log(error);
            });
    });
    
    app.get('/payments/feedback', function(request, response) {
         response.json({
            Payment: request.query.payment_id,
            Status: request.query.status,
            MerchantOrder: request.query.merchant_order_id
        })
    });

    app.get('/payments', async (req, res) => {
        const month = (req.query.month ? req.query.month : new Date().getMonth() + 1);
        
        const invoices = await invoiceModel.find({month: month});
        return res.render('facturas/index', {invoices});
      });
  
      app.post('/payments/create/:id', async (req, res) => {
        //id de la factura, para generar el recibo.
        const id = req.params.id;
  
        let invoice = await invoiceModel.findById(id);
        const expirationMoment = moment(invoice.expiration);
        let expiredTimes = expirationMoment.diff(new Date(), 'days');

        let interest = 0;

        if(invoice.payed) {
          return res.json({ok: false, msg: "La factura ya esta pagada."});
        }

        if( expiredTimes <= 0 ) {
            interest = expiredTimes * (invoice.total * 0.01);
        }

        let payment = paymentsModel({
            month: invoice.month,
            price: invoice.total,
            total: interest + invoice.total,
            interest 
        });

        let newPayment = await payment.save();

        if(newPayment) {
            invoice.payed = true;
            invoice.payment = newPayment._id;
            await invoice.save();

            return res.json({
                ok: true, 
                msg: "¡Recibo creado correctamente!.", 
                id_payment: newPayment._id
            })
        } else {
            return res.json({ok: false, msg:'Ha ocurrido un error. Intentalo mas tarde.'})
        }

      });

      app.get('/payments/detail/:id_payment/:id_invoice', async (req, res) => {
        const id_invoice = req.params.id_payment;
        const id_payment = req.params.id_invoice;
        const invoice = await invoiceModel.findById(id_invoice)
        .populate('contract_id')
        .populate('payment');
        let documentPath = '';

        if(!invoice || !invoice.payment || invoice.payment._id != id_payment) {
            return res.render('recibos/404');
        }

        if(!invoice.payment.doc_url) {
            personInfo = {
                name: invoice.contract_id.name+' '+invoice.contract_id.surname,
                address: "Dr. Valenzuela",
                postal_code: 3412,
                country: "Argentina",
                state: "Corrientes",
                city: "San Cosme"
            };

            let documentName = `${id_payment}-${personInfo.name}.pdf`;
            let pathDocuments = path.resolve(__dirname, `../public/documents`);
            documentPath = path.resolve(__dirname, `${pathDocuments}/${documentName}`);
            // let qrPath = `${pathDocuments}/${id_payment}QR.png`;
            //Temporalmente sin uso
            // QRCode.toFile(qrPath, `${req.protocol}://${req.get('host')}/invoice/detail/${id_payment}`, function (err) {
            //     if (err) throw err
            //     console.log('done')
            //   });

            const billingDate = moment(invoice.payment.createdAt).format('L');
            const paymentDetail = {
                personInfo,
                items: [{
                    description: "Mes correspondiente a " + moment(invoice.createdAt).format("MMMM"),
                    price: invoice.payment.total
                }],
                total: invoice.payment.total + ((invoice.payment.interest/100) * invoice.payment.total),
                order_number: id_payment,
                header:{
                    company_name: "",
                    company_logo: '',
                    company_address: "Documento no valido como factura"
                },
                footer:{
                  text: "data in rest"
                },
                currency_symbol:"ARS", 
                date: {
                  billingDate
                }
              };        

            getPDF(paymentDetail, documentPath);
            
        }
        
        
        setTimeout(async () => {
            await fs.unlinkSync(documentPath);
        }, 2000);

        setTimeout(() => {
            return res.sendFile(path.resolve(__dirname, documentPath));
        }, 1500);
        
      });

    //   app.get('/host', (req,res) => {
    //       return res.json({
    //           host: req.get('host')
    //       })
    //   })

}
