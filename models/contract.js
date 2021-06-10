const mongoose = require('mongoose');
let { Schema } = mongoose;
const invoiceModel = require('./invoice');

const contractSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
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
        type: Number,
        required: true
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
    },
    next_inc: {
        type: Date
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    invoices: [
        {
            type: Schema.Types.ObjectId,
            ref: 'invoices'
        }
    ]
});

contractSchema.methods.firstInvoice = async function() {
    //Definir la primera factura del contrato
    const date = new Date();
    const month = date.getMonth() + 1;
    let year = date.getFullYear();
    
    if(month>12) {
      year = year+1;
    }
    this.next_inc = date.setMonth(date.getMonth() + this.increment_month);
    let doc = await this.save();
    
    const period = `${month}/${this.pay_day}/${year}`;
    const expiration = (new Date(period)).getTime() + (8 * 86400000);
    let invoice = {
        contract_id: doc._id,
        total: doc.price,
        period,
        month: month +1,
        expiration
    };
    
    const newInvoice = await invoiceModel(invoice).save(); 
    this.invoices.push(newInvoice);

    await doc.save();
}

contractSchema.methods.nextInvoice = async function() {
    const date = new Date();
    const month = date.getMonth() + 1;
    if(month>12) {
        year = year+1;
      }
    let year = date.getFullYear();
    //Definir la proxima factura del mes
    const period = `${month}/${this.pay_day}/${year}`;
    let pa = new Date(this.proximo_aumento).getTime();
    let hoy = new Date();
    if(pa >= hoy.getTime()) {
        this.proximo_aumento = hoy.setMonth(hoy.getMonth() + this.increment_month)
        this.price = this.price + (this.price * (this.increment_porc / 100));
        await this.save()
    }
    const expiration = (new Date(period)).getTime() + (8 * 86400000);
    let invoice = {
        contract_id: this._id,
        total: this.price,
        period,
        month,
        expiration
    };

    let newInvoice = await invoiceModel(invoice).save();

    this.invoices.push(newInvoice._id);
    await this.save();
}

module.exports = mongoose.model('contracts', contractSchema);