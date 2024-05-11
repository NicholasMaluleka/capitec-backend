const mongoose = require('mongoose');
const Schema = require('mongoose')

const Customer = new mongoose.Schema({
   fullName: {type: String},
    ID: { type: String },
    contact: { type: Number },
    email: { type: String, lowercase: true, index: { unique: true } },
    pin: {type: String},
    accountNumber: {type: Number},
    status: {type: String},
    balance: {type: Number, required: false},
})

module.exports = mongoose.model('customer', Customer);


