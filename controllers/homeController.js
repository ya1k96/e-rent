const invoiceModel = require('../models/invoice');
const contractModel = require('../models/contract');
const invoicePDF = require('../functions/invoice');

module.exports = (app) => {
    app.get('/', async (req, res) => {
      let day = (new Date()).getDate();
      let month = (new Date()).getMonth() + 1;
      let contracts = await contractModel.find()
      .where('pay_day').gt(day);
      let data = {
        month,
        contracts
      };
      return res.render('home/index', {data});
    });

    app.get('/inquilinos', async(req, res) => {
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

    app.post('/inquilinos/add', (req,res) => {
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

    app.get('/invoice/:id', async (req, res) => {
        const id = req.params.id;

        const invoice = invoiceModel.find();

        const documentName = invoicePDF()

        setTimeout(() => {
          return res.sendFile(path.resolve(__dirname, './document.pdf'));
        }, 1500);
      
      });
      
}