const invoiceModel = require('./model');
const {moment} = require('../../utils/momentEs');
const { BAD_REQUEST_ERROR, BAD_GATEWAY } = require('../../utils/constants');
const { ID_NOT_FOUND, DEFAULT_MESSAGE } = require('../../utils/messagesConstants');

module.exports = {
    create: async (req, res) => {
        const body = req.body;
        const doc = await invoiceModel.create(body);
        if(!doc) {
            return responses.success(req, res, DEFAULT_MESSAGE, BAD_REQUEST_ERROR);
        }
        return responses.success(req, res, doc, RESPONSE_OK);
    },
    update: async (req, res) => {
        const body = req.body;
        const doc = await invoiceModel.updateOne(body);
        if(!doc) {
            return responses.success(req, res, DEFAULT_MESSAGE, BAD_REQUEST_ERROR);
        }
        return responses.success(req, res, doc, RESPONSE_OK);        
    },
    remove: async (req, res) => {
        const id = req.params.id;
        const resp = await invoiceModel.deleteOne(id);
        if(!resp) {
            return responses.success(req, res, ID_NOT_FOUND, BAD_REQUEST_ERROR);            
        }
        return responses.success(req, res, doc, RESPONSE_OK);        
    },
    getById: async (req, res) => {
        const id = req.params.id;
        const doc = await invoiceModel.invoiceDetail(id);

        if(!doc) {
            return responses.success(req, res, doc, RESPONSE_OK);
        }
        
        return responses.success(req, res, ID_NOT_FOUND, BAD_REQUEST_ERROR);
    }, 
    getAll: async (req, res) => {
        let date = moment().format('YYYY-MM-DD');
        let find = {};
        const from = req.query.from ? req.query.from: date;
        const until = req.query.until ? req.query.until: date;    
        const renter = req.query.renter;
        
        if(req.query.payed === 'true') find.payed = true;
        
        const docs = await invoiceModel.all(renter, from, until);                                
        return responses.success(req, res, docs, RESPONSE_OK);
    }
}