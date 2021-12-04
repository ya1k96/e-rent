const { create, getById, update, remove } = require('.');
const { validContract } = require('./validation');
const {notEmptyId} = require('../../middlewares/forms');

const router = require('express').Router();

router.post('/', validContract, create);
router.get('/', notEmptyId, getAll);
router.get('/:id', notEmptyId, getById);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;