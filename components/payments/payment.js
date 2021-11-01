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
   interest: {
       type: Number,
       default: 0
   },
   doc_url: {
       type: String
   }
}, {timestamps: true});

module.exports = mongoose.model('payments', paymentSchema);