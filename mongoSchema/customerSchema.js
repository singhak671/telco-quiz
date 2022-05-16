var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var customerData = new Schema({
    accountNumber: {
        type: String
    },
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    statustype: {
        type: String,
        default: 'active'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('customer', customerData, 'customer');