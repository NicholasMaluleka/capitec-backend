const express = require('express')
const app = express()
const cors = require('cors')

const mongoose = require('mongoose')

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/capitec')
    .catch(err => console.log('Something went wrong...', err))

// Middleware
app.use(express.json())
app.use(cors())

// ENV
const dotenv = require('dotenv')
dotenv.config()

// Routes
const routes = require('./routes/routes');
app.use(routes);



const PORT = 3000
app.listen(PORT, ()=> {
    console.log(`Capitec Server running on ${PORT}`)
})

