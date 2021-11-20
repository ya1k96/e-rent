const express = require('express');
const app = new express();
const path = require('path');
const cors = require('cors')
const db = require('./store/index');
const {serve, setup} = require('./doc/index');

const authRoute = require('./components/auth/route');
const usersRoute = require('./components/users/route');
const contractsRoute = require('./components/contracts/route');

//db connection method
db.connect();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const pathFile = path.join(__dirname, 'dist' );
app.use(express.static(pathFile));

// Routes
app.use('/api-docs', serve, setup);

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/contracts', contractsRoute);

module.exports = app;