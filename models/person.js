const mongoose = require('mongoose');
let { Schema } = mongoose;

const personSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    
});

module.exports = mongoose.model('persons', personSchema);