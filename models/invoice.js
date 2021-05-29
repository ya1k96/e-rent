const mongoose = require('mongoose');
let { Schema } = mongoose;

const invoiceSchema = new Schema({
  contract_id: {
      type: Schema.Types.ObjectId,
      ref: 'contracts'
  },
  total: {
      type: Number,
      require: true
  },
  period: {
      type: String,
      required:true
  },
  month: {
      type: Number,
      required: true
  },
  payed: {
      type: Boolean,
      default: false
  },
  expiration: {
      type: Date,
      required: true
  },
  payment: {
      type: Schema.Types.ObjectId,
      ref: 'payments'
  }
}, {
    timestamps: true
});

module.exports = mongoose.model('invoices', invoiceSchema);