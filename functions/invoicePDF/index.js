const getPDF = require('./invoice');
const {getBucket} = require('../storage');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

module.exports = {
    generateInvoice: async (invoice, payment) => {
        var documentPath = '';
        //Idealmente deberia tener los datos en el contrato
        //arreglar
        personInfo = {
            name: invoice.contract_id.name+' '+invoice.contract_id.surname,
            address: "Dr. Valenzuela",
            postal_code: 3412,
            country: "Argentina",
            state: "Corrientes",
            city: "San Cosme"
        };

        const billingDate = moment(invoice.payment.createdAt).format('L');
        var documentName = `${payment._id}${personInfo.name}.pdf`;
        var pathDocuments = path.resolve(__dirname, `../../public/documents`);
        documentPath = `${pathDocuments}/${documentName}`;

        if(!fs.existsSync(pathDocuments)) {
            fs.mkdirSync(pathDocuments);
        }

        let bucket = await getBucket();

        const paymentDetail = {
            personInfo,
            items: [{
                description: "Mes correspondiente a " + moment(invoice.createdAt).format("MMMM"),
                price: payment.total
            },
            {
                description: "Intereses por atraso en el pago",
                price: payment.interest
            }],
            total: payment.total + payment.interest,
            order_number: payment._id,
            header:{
                company_name: "",
                company_logo: '../../public/images/eRent_brand.png',
                company_address: ""
            },
            footer:{
                text: "",
                owner: "Cañete Marisa Elizabeth",
                pathSign: "../../public/images/signField.jpg"
            },
            currency_symbol:"ARS", 
            date: {
                billingDate
            }
        };    

        getPDF(paymentDetail, documentPath)
        .then(() => {
            bucket.upload(documentPath, {
                    destination: documentName,
                }).then(async () => {
                    //Eliminamos el archivo pdf temporal
                    fs.unlinkSync(documentPath);        
                    
                    payment.doc_url = documentName;
                    await payment.save();

                    return Promise.resolve({success: true});
                });

        })
    }
}