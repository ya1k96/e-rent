const { transporter } = require("./transporter");

module.exports = async (subject, text, emailTo, body) => {
  // send mail with defined transport object
  return await transporter.sendMail({
    from: '"E-rent admin" <yamil123_1@live.com>', // sender address
    to: emailTo, // list of receivers
    subject, // Subject line
    text, // plain text body
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
      ${body}
    </div>
    `, // html body
  });

}
