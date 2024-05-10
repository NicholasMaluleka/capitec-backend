const Admin = require('../models/admin');
const mongoose = require("mongoose")
// hash the password
const bcrypt = require('bcrypt')


module.exports = {
    defaultRoute: async (req, res) => {
        try {
            res.send('Welcome to My Backend');
        } catch (error) {
            res.status(500).send(error)
        }
    },
    //adding a new admin to the backend
    addAdmin: async (req, res) => {
        try {
            const payload = { ...req.body };
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(req.body.password, salt)
            payload.password = hashPassword
            const newAdmin = new Admin(payload)
            const result = await newAdmin.save()
            res.status(201).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },
    //Getting data for admins from backend
    getAdmin:  async (req, res) => {
        const results = await Admin.findOne({ email: req.params.email.toLowerCase() });
        if (!results) {
            res.send({ emailExists: false, passwordMatches: false });
        }
        bcrypt.compare(req.params.password, results.password, function (err, result) {
            res.send({ emailExists: true, passwordMatches: result, userAcc: results });
        });
    }
,
    updateAdmin: async (req, res) => {
        try {
          const admin = req.params.email;
          console.log('Updating admin:', admin);
          const updatedAdminData = req.body;
          console.log('New admin data:', updatedAdminData);
          const updatedAdmin = await Admin.findOneAndUpdate({ email: admin }, updatedAdminData, { new: true });
          console.log('Updated admin:', updatedAdmin);
          if (!updatedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
          }
          res.status(200).json(updatedAdmin);
        } catch (error) {
          console.error('Error updating admin:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      },
}