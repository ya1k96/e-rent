const express = require('express');
const app = new express();
const path = require('path');
const cors = require('cors')
const db = require('./store/index');
// const {serve, setup} = require('./doc/index');
const agenda = require('./functions/agenda');
const apiRouter = require('./components/route.index');
//db connection method
db.connect();

//agenda definition
agenda(db.MONGOOSE_CONNECTION_STRING);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//definicion de ruta principal
app.use('/api', apiRouter);

const pathFile = path.join(__dirname, 'dist' );
app.use(express.static(pathFile));


module.exports = app;