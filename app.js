const express = require('express');
const app = new express();
const mongoose= require('mongoose');
require('dotenv').config();
const Agenda = require('agenda');
const invoiceModel = require('./models/invoice');
const contractModel = require('./models/contract');

const dbUser = process.env.DBUSER;
const dbPassword = process.env.DBPASSWORD;
const dbUrl = process.env.DBURL;
const mongoConnectionString = `mongodb+srv://${dbUser}:${dbPassword}@${dbUrl}`;

mongoose.connect(mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define("create invoice", async (job) => {
    const date = new Date();
    const month = date.getMonth();
    const period = `${month}.${date.getFullYear()}`;
    const contracts = await contractModel.find({});

    if(contracts.length > 0) {
        contracts.forEach(async(contract) => {
            let invoice = {
                contract_id: contract._id,
                total: contract.price,
                period,
                month,
                expiration: date.getTime() + (8000 * 86400000)
            };

            await invoice.save();

            contract.invoices.push(invoice);
            await contract.save();
        })
    }
});

(async function () {
  // IIFE to give access to async/await
  await agenda.start();

  await agenda.every("1 months", "create invoice");
})();

db.once("open", function(){
    console.log("Conectado a la bd")
});

db.on("error", function(er){
    console.log("No se pudo conectar a la base de datos")
    console.log(er);
    app.get('/', function(req, res) {
        res.render('events/error');
    })
})
const homeController = require('./controllers/homeController');
const paymentsController = require('./controllers/payments');
const contract = require('./models/contract');

app.use(express.json());
app.use(express.static('./public'));
app.use(express.static('./views'));
app.set('view engine', 'ejs');

//Rutas
homeController(app);
paymentsController(app);

app.listen(3000,() => {

    console.log('SERVER RUN')
})