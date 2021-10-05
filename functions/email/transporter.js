const nodemailer = require("nodemailer");
require('dotenv').config();

//TODO: configurar el email con los datos que aporte el cliente
var user = process.env.MAIL,
    password = process.env.PASSWORDMAIL;
// create reusable transporter object using the default SMTP transport

var transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: user, 
    pass: password, 
  },
});

module.exports = transporter;