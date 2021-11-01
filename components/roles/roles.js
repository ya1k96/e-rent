const mongoose = require('mongoose');
let { Schema } = mongoose;

const rolesSchema = new Schema({
    type: {
        type: String,
        required: true,
        unique: true
    }
    
});

module.exports = mongoose.model('roles', rolesSchema);