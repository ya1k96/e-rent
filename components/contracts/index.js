const { DEFAULT_MESSAGE } = require('../../utils/messagesConstants');
const { RESPONSE_OK_CREATED, RESPONSE_OK, BAD_REQUEST_ERROR } = require('../../utils/constants');

const contractModel = require('./model');
const responses = require('../../network/response');

module.exports = {
    create: async (req, res) => {
        {        
          const body = req.body;              
          try {
            let end = body.begin.split('-');
            end[0] = parseInt(end[0]) + parseInt((body.months/12));
            let newContract = {
                name: body.name,
                surname: body.lastname,
                price: parseInt(body.price),
                begin: new Date(body.begin),
                end: new Date(end.join('/')),
                increment_porc: parseInt(body.increment_porc) || 6,
                increment_month: parseInt(body.increment_month)
            };

            const doc = await contractModel.create(newContract);
            await doc.firstInvoice();            

            return responses.success(req, res, doc, RESPONSE_OK_CREATED);            
          } catch (error) {
            console.log(error)
            return responses.error(req, res, {msg: DEFAULT_MESSAGE}, BAD_REQUEST_ERROR);
          }          
        }
      },
    getAll: async (req, res) => {
      try {
        const contract  = await contractModel.find({});
        return responses.success(req, res, contract, RESPONSE_OK);
      } catch (error) {
        return responses.error(req, res, {msg: DEFAULT_MESSAGE}, BAD_REQUEST_ERROR);          
      }
    },
    getById: async (req, res) => {
      const id = req.params.id;      
      try {
        const contract  = await contractModel.findById(id);
        return responses.success(req, res, contract, RESPONSE_OK);
      } catch (error) {
        return responses.error(req, res, {msg: DEFAULT_MESSAGE}, BAD_REQUEST_ERROR);          
      }
    },
    remove: async (req, res) => {
      const id = req.params.id;
      try {
        const contract  = await contractModel.findByIdAndRemove(id);
        return responses.success(req, res, contract, RESPONSE_OK);
      } catch (error) {
        return responses.error(req, res, {msg: DEFAULT_MESSAGE}, BAD_REQUEST_ERROR);          
      }
    },
    update: async (req, res) => {
      const body = req.body;  
      try {
        const doc = await contractModel.updateOne(body);
        if(doc) {
          return responses.success(req, res, {}, RESPONSE_OK);          
        }
        return responses.error(req, res, {msg: DEFAULT_MESSAGE}, BAD_REQUEST_ERROR);                              
      } catch (error) {
        return responses.error(req, res, {msg: DEFAULT_MESSAGE}, BAD_REQUEST_ERROR);                    
      }
    }
}