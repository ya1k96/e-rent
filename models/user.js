const mongoose = require('mongoose');
let { Schema } = mongoose;

const userSchema = new Schema({
    role: {
        type: Schema.Types.ObjectId,
        ref: 'roles',
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true
    },    
    isGoogle: {
        type: Boolean,
        default: false
    },
    isFacebook: {
        type: Boolean,
        default: false
    }
    
});

module.exports = mongoose.model('users', userSchema);