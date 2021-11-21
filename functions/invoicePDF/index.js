const getPDF = require('./invoice');
const {getBucket} = require('../storage');
const path = require('path');
const fs = require('fs');

module.exports = {
    generateInvoice: async (invoice, id_payment) => {
        let documentPath = '';
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
                return Promise.reject({success: false});
            }

            return Promise.resolve({url: result[0], success: true});
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
                company_name: "",
                company_logo: '../public/images/eRent_brand.png',
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
                    return Promise.resolve({url: result[0], success: true});
                });
            } else {
                return Promise.reject({success: false});
            }            

        });
    }
}