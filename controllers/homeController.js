const invoiceModel = require('../models/invoice');
const contractModel = require('../models/contract');
const { isUser, isAdmin } = require('../middlewares/auth');

module.exports = (app) => {    

    app.get('/', isAdmin, async (req, res) => {
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

    app.get('/inquilinos', isAdmin, async(req, res) => {
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

    app.get('/inquilinos/detail/:id', async (req, res) => {
      const id = req.params.id;
      if(!id) {
        return res.redirect('/');
      }

      let contract = await contractModel.findById(id)
      .populate('invoices');
      
      if(!contract) {
        return res.redirect('/');
      }

      return res.render('inquilinos/detail', {contract});

    })

    app.post('/inquilinos/add', isAdmin, (req,res) => {
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

      contractModel.create(contract, async (err,doc) => {
        if(err) {
          console.log(err)
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
          doc
        });
      });   
     

    });

    app.get('/login', (req, res) => {
      
      return res.render('auth/login');
    });

    app.get('/invoice', isAdmin, async (req, res) => {
      const invoices = await invoiceModel.find({})
      .populate('contract_id')
      console.log(invoices)
      return res.render('facturas/index', {invoices});
    });

    app.get('/invoice/detail/:id', async (req, res) => {
      const id = req.params.id;
      const invoice = await invoiceModel.findById(id)
      .populate(['contract_id','payment']);
      
      return res.render('facturas/detail', {invoice});
    });

    
}