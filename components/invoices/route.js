const router = require('express').Router();
const {update, create, remove, getAll, getById, nextExpire} = require('./index');

router.get('/all', getAll);
router.get('/dashboard', nextExpire);
router.post('/create', create);
router.put('/updateOne:id', update);
router.get('/getOne/:id', getById);
router.delete('/deleteOne/:id', remove);

module.exports = router;