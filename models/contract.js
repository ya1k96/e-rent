const mongoose = require('mongoose');
let { Schema } = mongoose;

const contractSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    begin: {
        type: Date,
        require: true
    },
    end: {
        type: Date,
        require: true
    },
    price: {
        type: Number
    },
    pay_day: {
        type: Number,
        default: 21
    },
    increment_month: {
        type: Number,
        default: 6
    },
    increment_porc: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('contracts', contractSchema);