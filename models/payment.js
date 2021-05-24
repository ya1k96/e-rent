const mongoose = require('mongoose');
let { Schema } = mongoose;

const paymentSchema = new Schema({
   month: {
       type: Number,
       required: true
   },
   price:{
        type: Number,
        required: true
   },
   total: {
       type: Number,
       required: true
   },
   payed: {
       type: Boolean,
       default: false
   },
   mora: {
       type: Boolean,
       default: false
   },
   interest: {
       type: Number,
       default: 0
   }
});

module.exports = mongoose.model('payments', paymentSchema);