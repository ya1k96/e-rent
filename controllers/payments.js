const invoiceModel = require('../models/invoice');
const paymentsModel = require('../models/payment');
const getPDF = require('../functions/invoice');
const {getBucket} = require('../functions/storage');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
moment.locale('es');

require('dotenv').config();
module.exports = (app) => {
      var genericalError = 'Ha ocurrido un error. Prueba intentando mas tarde';
      
      app.post('/api/payments/create/:id', async (req, res) => {
        //id de la factura, para generar el recibo.
        const id = req.params.id;
  
        let invoice = await invoiceModel.findById(id);
        const expirationMoment = moment(invoice.expiration);
        let expiredTimes = expirationMoment.diff(new Date(), 'days');

        let interest = 0;

        if(invoice.payed) {
          return res.status(400).json({msg: "La factura ya esta pagada."});
        }

        if( expiredTimes <= 0 ) {
            interest = (-expiredTimes) * (invoice.total * 0.01);
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

            return res.status(201).json({                
                msg: "¡Recibo creado correctamente!.", 
                id_payment: newPayment._id
            })
        } else {
            return res.status(400).json({msg: genericalError})
        }

      });

      app.get('/api/payments/detail/:id_invoice/:id_payment', async (req, res) => {
        const id_invoice = req.params.id_payment;
        const id_payment = req.params.id_invoice;
        const invoice = await invoiceModel.findById(id_invoice)
        .populate('contract_id')
        .populate('payment');
        let documentPath = '';

        if(!invoice || !invoice.payment || invoice.payment._id != id_payment) {
            return res.status(400).json({msg: genericalError});
        }
        
        personInfo = {
            name: invoice.contract_id.name+' '+invoice.contract_id.surname,
            address: "Dr. Valenzuela",
            postal_code: 3412,
            country: "Argentina",
            state: "Corrientes",
            city: "San Cosme"
        };

        const billingDate = moment(invoice.payment.createdAt).format('L');
        let documentName = `${id_payment}${personInfo.name}.pdf`;
        let pathDocuments = path.resolve(__dirname, `../public/documents`);
        documentPath = `${pathDocuments}/${documentName}`;

        if(!fs.existsSync(pathDocuments)) {
            fs.mkdirSync(pathDocuments);
        }

        let bucket = await getBucket();
        if(invoice.payment.doc_url) {
            let doc = bucket.file(documentName);

            const dateExp = new Date(); 
            dateExp.setHours(dateExp.getHours() + 1);

            const result = await doc.getSignedUrl({ action: "read" , expires : dateExp});
            if(result.length == 0) {
                return res.status(400).json({msg: genericalError});
            }

            return res.redirect(result[0]);
        }

        const paymentDetail = {
            personInfo,
            items: [{
                description: "Mes correspondiente a " + moment(invoice.createdAt).format("MMMM"),
                price: invoice.payment.total
            }],
            total: invoice.payment.total + ((invoice.payment.interest/100) * invoice.payment.total),
            order_number: id_payment,
            header:{
                company_name: "eRent",
                company_logo: '../public/icons/eRent-logo.png',
                company_address: ""
            },
            footer:{
                text: "",
                owner: "Cañete Marisa Elizabeth",
                pathSign: "../public/images/signField.jpg"
            },
            currency_symbol:"ARS", 
            date: {
                billingDate
            }
        };    

        getPDF(paymentDetail, documentPath)
        .then(() => {
                setTimeout(function(){

                    if(fs.existsSync(documentPath)) {
                        bucket.upload(documentPath, {
                            destination: documentName,
                        }).then(async () => {
                            //Eliminamos el archivo pdf temporal
                            fs.unlinkSync(documentPath);
        
                            invoice.payment.doc_url = documentName;
                            await invoice.payment.save();
                            
                            let doc = bucket.file(documentName);
        
                            const dateExp = new Date(); 
                            dateExp.setHours(dateExp.getHours() + 1);
        
                            const result = await doc.getSignedUrl({ action: "read" , expires : dateExp});
                            return res.redirect(result[0]);
                        });
                    } else {
                        return res.status(400).json({msg: genericalError})
                    }
                }, 2000);            

            });

    });        

//     app.get('/pdfkit', async (req, res) => {
//         let documentName = `12345Test.pdf`;
//         let pathDocuments = path.resolve(__dirname, `../public/documents`);
//         documentPath = `${pathDocuments}/${documentName}`;
//         personInfo = {
//             name: "Simon Martinez",
//             address: "Dr. Valenzuela",
//             postal_code: 3412,
//             country: "Argentina",
//             state: "Corrientes",
//             city: "San Cosme"
//         };
//         const paymentDetail = {
//             personInfo,
//             items: [{
//                 description: "Mes correspondiente a Julio",
//                 price: 5000
//             }],
//             total: 5000,
//             order_number: 000002,
//             header:{
//                 company_name: "eRent",
//                 company_logo: '../public/icons/eRent-logo.png',
//                 company_address: ""
//             },
//             footer:{
//                 text: "",
//                 owner: "Cañete Marisa Elizabeth",
//                 pathSign: "../public/images/signField.jpg"
//             },
//             currency_symbol:"ARS", 
//             date: {
//                 billingDate: '2000/12/12'
//             }
//         };    

//         await getPDF(paymentDetail, documentPath)

//         return res.sendFile(documentPath)
//     });

}
