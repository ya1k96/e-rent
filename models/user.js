const mongoose = require('mongoose');
let { Schema } = mongoose;
const uuid = require('uuid').v4;
const userSchema = new Schema({
    user_role: {
        type: Schema.Types.ObjectId,
        ref: 'roles',
        default: '60c17fa095f9fcf6d36b224b'
    },
    contract_id: {
        type: Schema.Types.ObjectId,
        ref: 'contracts',
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
    },
    name: {
        type: String
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    token_confirmation: {
        type: String,
        default: uuid()
    },
    req_new_password: {
        type: Boolean,
        default: false
    },
    token_new_password: {
        type: String,
        default: null
    }    
});
userSchema.createReqPassword = async function() {
    this.req_new_password = true;
    this.token_new_password = uuid();
    await this.save();
}
userSchema.methods.newPassword = async function(newPassword, reqToken) {
    if(this.req_new_password && this.token_new_password == reqToken) {
        this.password = md5(newPassword);
        await this.save();
    }
}

module.exports = mongoose.model('users', userSchema);