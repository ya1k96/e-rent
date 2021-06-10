const nodemailer = require("nodemailer");
require('dotenv').config();

// async..await is not allowed in global scope, must use a wrapper
module.exports = async (toEmail, url) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
    let user = process.env.MAIL;
    let password = process.env.PASSWORDMAIL;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: user, // generated ethereal user
      pass: password, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"E-rent admin" <yamil123_1@live.com>', // sender address
    to: toEmail, // list of receivers
    subject: "Confirma tu correo electronico E-rent", // Subject line
    text: "Hola! Ya estas a nada de usar tu cuenta", // plain text body
    html: `
    <style>
      .center {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
      }
      .b-example-divider {
        height: 3rem;
        border: solid rgba(0, 0, 0, .15);
        border-width: 1px 0;
        box-shadow: inset 0 0.5em 1.5em rgb(0 0 0 / 10%), inset 0 0.125em 0.5em rgb(0 0 0 / 15%);
      }
      .shadow-lg {
        box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
      }
      .card {
        background-color: white;
        padding: 24px 23px 20px;
        position: relative;
        border-radius: 6px;
      }
      .btn {
        border: none;
        font-size: 15px;
        font-weight: normal;
        line-height: 1.4;
        border-radius: 4px;
        padding: 10px 15px;
        -webkit-font-smoothing: subpixel-antialiased;
        transition: border .25s linear, color .25s linear, background-color .25s linear;
      }
      .btn-info {
        color: white;
        background-color: #3498db;
      }
    </style>
    <div class="center shadow-lg card">
      <p>Hola! Por favor confirma tu correo haciendo click en el siguiente link</p>
      <a href="${url}" >Confirmar mi correo</a>
    </div>
    `, // html body
  });

}

