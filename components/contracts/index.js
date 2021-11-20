const { DEFAULT_MESSAGE } = require('../../utils/messagesConstants');
const { RESPONSE_OK_CREATED, RESPONSE_OK } = require('../../utils/constants');

const contractModel = require('./model');
const responses = require('../../network/response');

module.exports = {
    create: (req, res) => {
        {        
          const body = req.body;              
          try {
            const doc = await contractModel.newContract(body);
            return responses.error(req, res, doc, RESPONSE_OK_CREATED);            
          } catch (error) {
            return responses.error(req, res, {msg: DEFAULT_MESSAGE}, BAD_REQUEST_ERROR);
          }          
        }
      },
      getById: async (req, res) => {
        const id = req.body.id;
        try {
          const contract  = await contractModel.findById(id);
          return responses.success(req, res, contract, RESPONSE_OK);
        } catch (error) {
          return responses.error(req, res, {msg: DEFAULT_MESSAGE}, BAD_REQUEST_ERROR);          
        }
      },
      remove: (req, res) => {
        const id = req.body.id;
        try {
          const contract  = await contractModel.findByIdAndRemove(id);
          return responses.success(req, res, contract, RESPONSE_OK);
        } catch (error) {
          return responses.error(req, res, {msg: DEFAULT_MESSAGE}, BAD_REQUEST_ERROR);          
        }
      },
      update: (req, res) => {
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