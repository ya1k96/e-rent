const mongoose = require('mongoose');
let { Schema } = mongoose;

const rolesSchema = new Schema({
    type: {
        type: String,
        required: true,
        unique: true
    }
    
});

rolesSchema.methods.upsert = (body) => {
    const option = { upsert: body.id ? true : false}
    return this.findOneAndUpdate(body.id, body, option);
}

module.exports = mongoose.model('roles', rolesSchema);