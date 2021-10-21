const express = require('express');
const app = new express();
const mongoose= require('mongoose');
const webpush = require('web-push');
const Agenda = require('agenda');
const path = require('path');
require('dotenv').config();
const cors = require('cors')
const contractModel = require('./models/contract');

const dbUser = process.env.DBUSER;
const dbPassword = process.env.DBPASSWORD;
const dbUrl = process.env.DBURL;
const produccion = process.env.PRODUCTION;

let mongoConnectionString = `mongodb+srv://${dbUser}:${dbPassword}@${dbUrl}`;

if(produccion === 'false') {
    mongoConnectionString = 'mongodb://127.0.0.1:27017'
}

mongoose.connect(mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define("create invoice", async (job) => {
    const contracts = await contractModel.find({});
    
    if(contracts.length > 0) {
        contracts.forEach(async(contract) => {
            await contract.nextInvoice();
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
})

app.use(cors())
app.use(express.json());
app.use(express.static('./public'));

const pathFile = path.join(__dirname, 'dist' );
app.use(express.static(pathFile));

const userController = require('./controllers/userController');
const homeController = require('./controllers/homeController');
const paymentsController = require('./controllers/paymentsController');

//Rutas
userController(app);
homeController(app);
paymentsController(app);

app.listen((process.env.PORT||8080),() => {
    console.log('SERVER RUN')
})