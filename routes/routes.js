const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer')

const storage = multer.memoryStorage();
const upload = multer({ storage })
let files = [{ name: 'file1', maxCount: 1}, { name: 'file2', maxCount: 1 }]

//new Admin routes
const adminController = require('../controllers/adminControllers');
router.get('/', adminController.defaultRoute);
router.get('/add-admin', adminController.addAdmin);
router.post('/get-admin/:email', adminController.getAdmin)
router.put('/update-admin/:email', adminController.updateAdmin)

//customer routes
const customerController = require('../controllers/customerControllers');
const fileController = require('../controllers/fileControllers')
router.post('/add-customer', customerController.registerRoute)
router.post('/customer-login', customerController.loginRoute)
router.put('/update-customer/:email', customerController.updateCustomer)
router.post('/add-doc', upload.any(files), fileController.uploadFile);
router.get('/get-customer', customerController.getCustomers)

module.exports = router;
