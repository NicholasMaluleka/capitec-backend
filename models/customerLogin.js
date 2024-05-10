const mongoose = require('mongoose');
const Schema = require('mongoose')

const Login = new mongoose.Schema({
    email: {type: String, required: true},
    pin: {type: String, required: true}
})

module.exports = mongoose.model('login', Login);