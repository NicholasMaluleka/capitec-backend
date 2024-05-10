const adminSchema = require('../models/admin');
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
            let Admin = {
                "name": "Capitec",
                "surname": "Admin",
                // "gender": "male",
                // "id": "4564545645645",
                "email": "kimberlymnguni@gmail.com",
                "role": "admin",
                "password": "123"
            }
            const isAdminFound = await adminSchema.findOne({ role: 'admin' })
            if (!isAdminFound) {
                const saltRounds = 10;
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    bcrypt.hash(Admin.password, salt, async function (err, hash) {
                        console.log("err", err)
                        console.log("hashed  password", hash)
                        Admin.password = hash;
                        Admin.email = Admin.email.toLowerCase();
                        const validationResult = new adminSchema(Admin)
                        const result = await validationResult.save()
                        res.send(result)
                    });
                });
            }
        } catch (err) {
            res.send(err)
        }
    },
    //Getting data for admins from backend
    getAdmin: async (req, res) => {
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