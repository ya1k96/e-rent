const express = require('express');
const app = new express();
const path = require('path');
const cors = require('cors')
const db = require('./store/index');

const authRoute = require('./components/auth/route');
// const paymentsRoute = require('./components/payments/index');
// const rolesRoute = require('./components/roles/index');
const errors = require('./network/errors');

//db connection method
db.connect();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const pathFile = path.join(__dirname, 'dist' );
app.use(express.static(pathFile));

// Routes
app.use('/api/auth', authRoute);
// app.use('/api/payments', paymentsRoute);

app.use(errors);

module.exports = app;