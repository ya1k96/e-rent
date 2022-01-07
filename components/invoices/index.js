const invoiceModel = require('./model');
const moment = require('moment');
const { BAD_REQUEST_ERROR, BAD_GATEWAY, RESPONSE_OK } = require('../../utils/constants');
const { ID_NOT_FOUND, DEFAULT_MESSAGE } = require('../../utils/messagesConstants');
const responses = require('../../network/response');
const { getBucket } = require('../../functions/storage');

const create = async (req, res) => {
    const body = req.body;
    const doc = await invoiceModel.create(body);
    if(!doc) {
        return responses.success(req, res, DEFAULT_MESSAGE, BAD_REQUEST_ERROR);
    }
    return responses.success(req, res, doc, RESPONSE_OK);
}

const update = async (req, res) => {
    const body = req.body;
    const doc = await invoiceModel.updateOne(body);
    if(!doc) {
        return responses.success(req, res, DEFAULT_MESSAGE, BAD_REQUEST_ERROR);
    }
    return responses.success(req, res, doc, RESPONSE_OK);        
}

const remove = async (req, res) => {
    const id = req.params.id;
    const resp = await invoiceModel.deleteOne(id);
    if(!resp) {
        return responses.success(req, res, ID_NOT_FOUND, BAD_REQUEST_ERROR);            
    }
    return responses.success(req, res, doc, RESPONSE_OK);        
}

const getById = async (req, res) => {
    const id = req.params.id;
    //TODO: pasar luego al modelo
    const doc = await invoiceModel.findById(id).populate(['contract_id', 'payment']);
    
    if(doc) {
        if (!doc.payment?.doc_url) return responses.success(req, res, doc, RESPONSE_OK);
        let bucket = await getBucket();
        let file = bucket.file(doc.payment.doc_url);

        const dateExp = new Date(); 
        dateExp.setHours(dateExp.getHours() + 1);
        const result = await file.getSignedUrl({ action: "read" , expires : dateExp});
        doc.payment.doc_url = result[0];

        return responses.success(req, res, doc, RESPONSE_OK);
    };
    
    return responses.success(req, res, ID_NOT_FOUND, BAD_REQUEST_ERROR);
}

const getAll = async (req, res) => {
    let date = moment().format('YYYY-MM-DD');
    let find = {};
    const from = req.query.from || moment(date).subtract(1, 'M');
    const until = req.query.until || date;
    const renter = req.query.renter || '';
    
    if(req.query.payed === 'true') find.payed = true;
    const regexp = new RegExp(renter, 'i');        
    
    const docs = await invoiceModel.find(find)      
    .populate({path: "contract_id", match: {name: regexp}})            
    .where('createdAt').gt(from).lt(until)
    
    return responses.success(req, res, docs, RESPONSE_OK);
}

const nextExpire = (req, res) => {        
    invoiceModel.find({payed: false})
    .populate('contract_id')
    .then(doc => responses.success(req, res, doc, RESPONSE_OK))
    .catch(err => {
        console.log(err)
        return responses.success(req, res, err, BAD_REQUEST_ERROR);
    });                     
}

module.exports = {create, update, remove, getById, getAll, nextExpire}