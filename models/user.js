const mongoose = require('mongoose');
let { Schema } = mongoose;

const userSchema = new Schema({
    nickname: {
        type: String,
        required: true,
        unique: true
    },    
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
    
});

module.exports = mongoose.model('users', userSchema);