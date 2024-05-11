const express = require('express')
const app = express()
const cors = require('cors')
const multer = require('multer') // Import multer

const mongoose = require('mongoose')

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/capitec')
    .catch(err => console.log('Something went wrong...', err))

// Multer Middleware Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware
app.use(express.json())
app.use(cors())

// ENV
const dotenv = require('dotenv')
dotenv.config()

// Routes
const routes = require('./routes/routes');

// Multer Middleware
app.use(upload.single('file'));

// Use routes
app.use(routes);

const PORT = 3000
app.listen(PORT, ()=> {
    console.log(`Capitec Server running on ${PORT}`)
})
