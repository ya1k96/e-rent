const router = require('express').Router();
const Controller = require('./index');
const responses = require('../../network/response');
const { RESPONSE_OK_CREATED, RESPONSE_OK } = require('../../utils/constants');
const err = require('../../utils/error');

function get(res, req, next) {
    Controller.get(req)
    .then(data => responses.success(req,res, data, RESPONSE_OK_CREATED))
    .catch(error => next(err(error)))    
}

function insert(res, req, next) {
    Controller.upsert(req)
    .then(data => responses.success(req,res, data, RESPONSE_OK_CREATED))
    .catch(error => next(err(error)))    
}

function update(res, req, next) {
    Controller.upsert(req)
    .then(data => responses.success(req,res, data, RESPONSE_OK))
    .catch(error => next(err(error)))    
}

function deleteOne(res, req, next) {
    Controller.remove(req)
    .then(data => responses.success(req, res, data, RESPONSE_OK))
    .catch(error => next(err(error)));
}

router.post('/', insert);
router.get('/:id', get);
router.delete('/:id', deleteOne);
router.patch('/:id', update);

module.exports = router;