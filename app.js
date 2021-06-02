const express = require('express');
const app = new express();
const mongoose= require('mongoose');
const webpush = require('web-push');
const Agenda = require('agenda');
require('dotenv').config();

const contractModel = require('./models/contract');

const dbUser = process.env.DBUSER;
const dbPassword = process.env.DBPASSWORD;
const dbUrl = process.env.DBURL;
const mongoConnectionString = `mongodb+srv://${dbUser}:${dbPassword}@${dbUrl}`;
console.log(mongoConnectionString)
mongoose.connect(mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
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

const vapidKeys = {
    publicKey: process.env.PUBLICKEYPUSH,
    privateKey: process.env.PRIVATEKEYPUSH
};

webpush.setVapidDetails(
    'mailto:example@yourdomain.org', // 1
    vapidKeys.publicKey, // 2
    vapidKeys.privateKey // 3
);

db.once("open", function(){
    console.log("Conectado a la bd")
});

db.on("error", function(er){
    console.log("No se pudo conectar a la base de datos")
    console.log(er);   
})

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});
const clientList = [];
app.post('/subscribe', (req,res) => {
    const body = req.body;
    try {
        clientList.push(body);
      } catch (e) {
        console.log(e);
      }
    return res.json({ok: true})
})
app.get('/send', (req,res) => {
    console.log(clientList);
    try {
        clientList.forEach(subItem => {
            webpush.sendNotification(subItem, JSON.stringify({ title:"No hay pan", body: "pepe" }));
        });
    } catch (e) {
    console.log(e);
    }

    return res.json({ok: true})
})
  
const userController = require('./controllers/userController');
const homeController = require('./controllers/homeController');
const paymentsController = require('./controllers/payments');

app.use(express.json());
app.use(express.static('./public'));
app.use(express.static('./views'));
app.set('view engine', 'ejs');

//Rutas
userController(app);
homeController(app);
paymentsController(app);

app.listen((process.env.PORT||3000),() => {

    console.log('SERVER RUN')
})