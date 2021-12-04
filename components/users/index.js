const responses = require('../../network/response');
const userModel = require('../auth/model');
const { RESPONSE_OK, BAD_REQUEST_ERROR } = require('../../utils/constants');
const { DEFAULT_MESSAGE } = require('../../utils/messagesConstants');

module.exports = {    
    getAll: async (req, res) => {
        try {
            return responses.success(req,res, await userModel.find({}), RESPONSE_OK);            
        } catch (error) {
            return responses.error(req, res, DEFAULT_MESSAGE, BAD_REQUEST_ERROR);
        }   
    },
    getById: async (req,res) => {
        const id = req.body.id;
        try {
            return responses.success(req,res, await userModel.findById(id), RESPONSE_OK);            
        } catch (error) {
            return responses.error(req, res, DEFAULT_MESSAGE, BAD_REQUEST_ERROR);
        } 
    },
    destroy: async (req, res) => {
        const id = req.body.id;
        try {
            return responses.success(req,res, await userModel.findOneAndRemove(id), RESPONSE_OK);            
        } catch (error) {
            return responses.error(req, res, DEFAULT_MESSAGE, BAD_REQUEST_ERROR);
        } 
    },
    update: async (req, res) => {
        try {
            const resp = await userModel.updateOne(req.body);
            return responses.success(req,res, resp, RESPONSE_OK);            
        } catch (error) {
            return responses.error(req, res, DEFAULT_MESSAGE, BAD_REQUEST_ERROR);
        } 
    }
}