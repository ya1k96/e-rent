const express = require('express');
const app = new express();
const mongoose= require('mongoose');
require('dotenv').config();
const webpush = require('web-push');
const Agenda = require('agenda');
var firebase = require('firebase');
// const session = require('express-session'); 
// const MongoStore = require('connect-mongo');
var firebaseConfig = {
    apiKey: "AIzaSyDyjuCMt0nGfwZkBZXTNutSvkZyS6tvpFw",
    authDomain: "e-rent-16ae4.firebaseapp.com",
    databaseURL: "https://e-rent-16ae4.firebaseio.com",
    projectId: "e-rent-16ae4",
    storageBucket: "e-rent-16ae4.appspot.com",
    messagingSenderId: "852609468771",
    appId: "1:852609468771:web:651bc3cedfe83c876beb56",
    measurementId: "G-MEASUREMENT_ID",
  };
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
/*
Temporalmente sin uso
*/
// app.use(session({ 
//     secret: process.env.SESSION_SECRET || 'some-secret', 
//     resave: false, // investigar mas -> https://www.npmjs.com/package/express-session 
//     saveUninitialized: false, 
//     store: MongoStore.create({ mongoUrl: mongoConnectionString})
// }));

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
  
firebase.initializeApp(firebaseConfig);
const userController = require('./controllers/userController');
const homeController = require('./controllers/homeController');
const paymentsController = require('./controllers/payments');

app.use(express.json());
app.use(express.static('./public'));
app.use(express.static('./views'));
app.set('view engine', 'ejs');

//Rutas
userController(app, firebase);
homeController(app, firebase);
paymentsController(app, firebase);

app.listen((process.env.PORT||3000),() => {

    console.log('SERVER RUN')
})