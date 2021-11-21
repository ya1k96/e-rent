const router = require('express').Router();
const {update, create, remove, getAll, getById} = require('./index');

router.get('invoices', getAll);
router.post('invoices', create);
router.put('invoices/:id', update);
router.get('invoices/:id', getById);
router.delete('invoices/:id', remove);

module.exports = router;