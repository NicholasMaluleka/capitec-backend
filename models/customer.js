const mongoose = require('mongoose');
const Schema = require('mongoose')

const Customer = new mongoose.Schema({
    name: { type: String, },
    surname: { type: String, },
    ID: { type: String, },
    gender: { type: String, },
    contact: { type: Number, },
    email: { type: String, lowercase: true, index: { unique: true } },
    pin: {type: String,},
    balance: {type: Number, required: false},
})

module.exports = mongoose.model('customer', Customer);


