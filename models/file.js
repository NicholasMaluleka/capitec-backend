const mongoose = require('mongoose')

const File = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    fileId: { type: String, required: true },
    size: { type: String, required: true },
    commonId: { type: String, required: true }
})


module.exports = mongoose.model('File',File);