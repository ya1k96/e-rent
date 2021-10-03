const invoiceModel = require('../models/invoice');
const contractModel = require('../models/contract');
const { isUser } = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');
const moment = require('moment');

module.exports = (app) => {    

    app.get('/api/dashboard',  async (req, res) => {
     const renters = await invoiceModel.find({payed: false})
     .populate('contract_id');

      return res.json({
        ok: true,
        renters
      })
    });

    app.get('/api/renters',  async(req, res) => {
      let renters = await contractModel.find({});    

      return res.json({
        ok: true, 
        renters
      });
    });

    app.route('/api/renters/detail/:id')    
    .get(async (req, res) => {
      const id = req.params.id;
      if(!id) {
        return res.redirect('/');
      }

      let contract = await contractModel.findById(id)
      .populate('invoices');
      
      if(!contract) {
        return res.json({ok: false});
      }

      return res.json({ok: true, contract})
    })

    app.post('/api/renters/add', 
    check('name')
    .notEmpty()
    .withMessage('El nombre es requerido'),         
    check('lastname')
    .notEmpty()
    .withMessage('El apellido es requerido'), 
    check('price')
    .notEmpty()
    .withMessage('El monto es requerido'), 
    check('begin')
    .notEmpty()
    .withMessage('Establece la fecha de inicio del contrato'), 
    check('increment_month')
    .notEmpty()
    .withMessage('Establece el periodo de incremento'), 
    check('increment_porc')
    .notEmpty()
    .withMessage('Establece el porcentaje de incremento'), 
    (req,res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ ok: false, errors: errors.array() });
      }

      const body = req.body;
      let end = body.begin.split('-');
      end[0] = parseInt(end[0]) + parseInt((body.months/12));
      let contract = {
        name: body.name,
        surname: body.lastname,
        price: parseInt(body.price),
        begin: new Date(body.begin),
        end: new Date(end.join('/')),
        increment_porc: parseInt(body.increment_porc) || 6,
        increment_month: parseInt(body.increment_month)
      };
      console.log(contract)
      contractModel.create(contract, async (err, doc) => {
        if(err) {
          return res.json({
            ok: false,
            msg: 'Ha ocurrido un error. Intenta mas tarde.'
          });
        }
        
        //Creamos la primera factura del contrato
        await doc.firstInvoice();

        return res.json({
          ok: true,
          msg: 'Perfecto! Hay un nuevo inquilino.',
          contract
        });
      });   
     

    });

    app.route('/api/invoices')
    .get( async (req, res) => {
      let date = moment().format('YYYY-MM-DD');
      let find = {};
      const from = req.query.from ? req.query.from: date;
      const until = req.query.until ? req.query.until: date;    
      if(req.query.payed === 'true') find.payed = true;
      const regexp = new RegExp(req.query.renter, 'i');        
      let invoices = []; 

      let resp = invoiceModel.find(find)      
      .populate({path: "contract_id", match: {name: regexp}})            
      .where('createdAt').gt(from).lt(until)

      await resp.exec((err, result) => {
        if(err) return res.status(204).json({ok: false, invoices: []})
        console.log(result)
        invoices = result.filter( invoice => invoice.contract_id !== null)
        return res.json({ok: true, invoices});
      })
    
    });

    // app.get('/invoice/detail/:id', async (req, res) => {
    //   const userData = {
    //     name: req.session.name,
    //     role: req.session.role
    //   };
    //   const id = req.params.id;
    //   const invoice = await invoiceModel.findById(id)
    //   .populate(['contract_id','payment']);
      
    //   return res.render('facturas/detail', {invoice, userData});
    // });

    app.get('/api/invoices/detail/:id', async (req, res) => {
      const id = req.params.id;
      const invoice = await invoiceModel.findById(id)
      .populate(['contract_id','payment']);
      
      return res.json({
        ok: true, invoice
      });
    });    

    app.route('/api/pruebas')
    .get(async (req, res) => {         
      const regexp = new RegExp('lucas', 'i');
      
      let invoices = await invoiceModel.find()      
      .populate({path: "contract_id", match: {name: regexp}})
      .where('contract_id').ne(null)

      return res.json({ok: true, invoices});

    });
}