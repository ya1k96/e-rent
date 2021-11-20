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

invoiceSchema.methods.invoiceDetail = (invoiceId) => {
    return this.findById(invoiceId).populate(['contract_id','payment']);
}
invoiceSchema.methods.filter = (renter, from, until) => {
    const regexp = new RegExp(renter, 'i');        

    return this.find(find)      
    .populate({path: "contract_id", match: {name: regexp}})            
    .where('createdAt').gt(from).lt(until)
}

module.exports = mongoose.model('invoices', invoiceSchema);