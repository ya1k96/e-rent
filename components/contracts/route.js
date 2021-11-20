const { create, getById, update, remove } = require('.');
const { validContract } = require('./validation');
const {notEmptyId} = require('../../middlewares/forms');

const router = require('express').Router();

router.post('/', validContract, create);
router.get('/:id', notEmptyId, getById);
router.update('/:id', update);
router.delete('/:id', remove);

module.exports = router;