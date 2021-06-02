const invoiceModel = require('../models/invoice');
const paymentsModel = require('../models/payment');
const contractModel = require('../models/contract');
const invoicePDF = require('../functions/invoice');
const invoice = require('../models/invoice');
const {firebase} = require('../functions/firebase');

module.exports = (app) => {
    let middleware = (req,res,next) => {
      var user = firebase.auth().currentUser;
      if(user) {
          next();
      } else {
        let url = req.protocol +'://'+ req.get('host') +'/login';
        return res.redirect(url);
      }
    }
    app.get('/', middleware, async (req, res) => {
      let day = (new Date()).getDate();
      let month = (new Date()).getMonth() + 1;
      let contracts = await contractModel.find({}).populate({
        path: 'invoices'       
      })

    let renters = [];
    contracts.forEach((contract) => {
      let invoices = contract.invoices.filter(invoice => invoice.payed != true);
      let renter = {
        invoices,
        name: contract.name + ' ' + contract.surname,
        id: contract._id,
        pay_day: contract.pay_day        
      };
      if(invoices.length > 0) {
        renters.push(renter);
      }
    });

      let data = {
        month,
        renters
      };
      return res.render('home/index', {data});
    });

    app.get('/inquilinos', middleware, async(req, res) => {
      let data = {};
      if(req.query.status) {
        data.status = {
          class: req.query.status,
          msg: 'Perfecto! Hay un nuevo inquilino'
        }
      }

      data.inquilinos = await contractModel.find({});    

      return res.render('inquilinos/index', {data: data});
    });

    app.post('/inquilinos/add', middleware, (req,res) => {
      const body = req.query;
      let contract = {
        name: body.name,
        surname: body.surname,
        price: parseInt(body.price),
        begin: new Date(body.begin),
        end: new Date(body.end),
        increment_porc: parseInt(body.increment_porc),
        increment_month: parseInt(body.increment_month)
      };

      contractModel.create(contract, (err,doc) => {
        if(err) {
          console.log(err)
          return res.json({
            ok: false,
            msg: 'Ha ocurrido un error. Intenta mas tarde.'
          });
        }

        return res.json({
          ok: true,
          msg: 'Perfecto! Hay un nuevo inquilino.',
          doc
        });
      });   
     

    });

    app.get('/login', (req, res) => {
      
      return res.render('auth/login');
    });

    app.get('/invoice/detail/:id', middleware, async (req, res) => {
      const id = req.params.id;
      const invoice = await invoiceModel.findById(id)
      .populate(['contract_id','payment']);
      
      return res.render('facturas/detail', {invoice});
    });

    app.get('/invoice', middleware, async (req, res) => {
      const invoices = await invoiceModel.find({})
      .populate('contract_id')
      .limit(3);
      return res.render('facturas/index', {invoices});
    });
    
}