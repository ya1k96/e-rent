const rolesModel = require('./model');

module.exports = {
    upsert: (req) => rolesModel.upsert(req.body),
    remove: (req) => rolesModel.deleteOne(req.body.id),
    get: (req) => rolesModel.findById(req.body.id)
}