const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')


//new Admin routes
const adminController = require('../controllers/adminControllers');
router.get('/', adminController.defaultRoute);
router.post('/add-admin', adminController.addAdmin);
router.post('/get-admin/:email', adminController.getAdmin)
router.put('/update-lead/:email', adminController.updateAdmin)

//customer routes
const customerController = require('../controllers/customerControllers');
router.post('/add-customer', customerController.registerRoute)
router.post('/customer-login', customerController.loginRoute)
router.put('/update-customer/:email', customerController.updateCustomer)

module.exports = router;
