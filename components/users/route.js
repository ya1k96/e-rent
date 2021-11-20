const { getAll, getById, update, destroy } = require('.');
const { notEmptyId } = require('../../middlewares/forms');

const router = require('express').Router();
/** 
 * @swagger
 * 
*/
router.get('/all', getAll);
/** 
 * @swagger
 * 
*/
router.get('/:id', notEmptyId, getById);
/** 
 * @swagger
 * 
*/
router.update('/:id', notEmptyId, update);
/** 
 * @swagger
 * 
*/
router.delete('/:id', notEmptyId, destroy);

module.exports = router;