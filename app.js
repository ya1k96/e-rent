const express = require('express');
const app = new express();
const path = require('path');
const cors = require('cors')
const db = require('./store/index');

const userRoute = require('./components/user/route');
// const paymentsRoute = require('./components/payments/payment');
const errors = require('./network/errors');

//db connection method
db.connect();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('./public'));

const pathFile = path.join(__dirname, 'dist' );
app.use(express.static(pathFile));

// Routes
app.use('/api/user', userRoute);
// app.use('/api/payments', paymentsRoute);

app.use(errors);

module.exports = app;