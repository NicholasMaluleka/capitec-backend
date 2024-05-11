const Customer = require('../models/customer.js')
const Login = require('../models/customerLogin.js')
const File = require('../models/file');
const { Readable } = require("stream")
const mongoose = require("mongoose")


const bcrypt = require('bcrypt')
// create json web token
const jwt = require('jsonwebtoken')
// Sending email
const sendMail = require('../sendMail.js');
//creating an Accout Number

let bucket;
mongoose.connection.on("open", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
})

const pictureId = `picture-${new Date().getTime()}`;

module.exports = {
    registerRoute: async (req, res, next) => {
        try {
            req.body.accountNumber= new Date().getTime().toString()
            const salt = await bcrypt.genSalt(10)
            const hashPin = await bcrypt.hash(req.body.pin, salt)
            const payload = { ...req.body, };
            payload.pin = hashPin
            const newCustomer = new Customer(payload)

            const result = await newCustomer.save()

             // Send email to the created email address
             const mailOptions = {
                from: {
                    name: "Nicholas Maluleka",
                    address: "lesetjamaluleka@gmail.com"
                },
                to: req.body.email.toString(),
                subject: "New Account Created",
                text: "Account successfully created",
                html: `<b>Your Account with Capitec has been successfully created</b> <br>
                Your Bank account Number is <b>${req.body.accountNumber}</b>
                <br>
                <br>
               <center> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Capitec_Bank_logo.svg/768px-Capitec_Bank_logo.svg.png" width="250px" height="80px"/> </center>`,
            };
            sendMail(mailOptions);

            res.status(201).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },
    getCustomers: async (req, res) => {
        try {
            const result = await Customer.find(req.params);
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error);
        }
    },
    
    loginRoute: async (req, res, next) => {
        try {
            const customer = await Customer.findOne({ email: req.body.email })
        
            if (!customer) {
                return res.status(404).send("User Not found!");
            }

            const isPinCorrect = await bcrypt.compare(req.body.pin.toString(), customer.pin.toString());
            if (!isPinCorrect) {
                return res.status(404).send("Pin is Incorrect!");
            }
    
            const token = jwt.sign({
                id: customer._id,
            }, process.env.JWT_SECRET);
    
            res.cookie("access_token", token, { httpOnly: true });
            res.status(200).json({
                status: 200,
                message: "Login Success",
                data: customer
            });
    
        } catch (error) {
            // If an error occurs, return a 500 error response
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    sendMail: async (req, res, next) => {
        try {
             // Send email to the created email address
             const mailOptions = {
                from: {
                    name: "Nicholas Maluleka",
                    address: "lesetjamaluleka@gmail.com"
                },
                to: req.body.email.toString(),
                subject: "New Account Created",
                text: "Account successfully created",
                html: "<b>Account successfully created</b>",
            };
            sendMail(mailOptions);

        } catch (error) {
            res.status(500).send(error)
        }
    },
    updateCustomer: async (req, res) => {
        try {
          const customer = req.params.email;
          console.log('Updating customer:', customer);
          const updatedCustomerData = req.body;
          console.log('New customer data:', updatedCustomerData);
          const updatedCustomer = await Customer.findOneAndUpdate({ email: customer }, updatedCustomerData, { new: true });
          console.log('Updated customer:', updatedCustomer);
          if (!updatedCustomer) {
            return res.status(404).json({ message: 'customer not found' });
          }
          res.status(200).json(updatedCustomer);
        } catch (error) {
          console.error('Error updating customer:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      },
      uploadFile: async (req, res) => {
        try {
            const { file } = req;
    
            if (!file) {
                return res.status(400).send("No file was uploaded.");
            }
    
            const { originalname, mimetype, buffer } = file;
    
            let newFile = new File({
                filename: originalname,
                contentType: mimetype,
                length: buffer.length,
                fileId: pictureId,
            });
    
            const uploadStream = bucket.openUploadStream(originalname);
            const readBuffer = new Readable();
            readBuffer.push(buffer);
            readBuffer.push(null);
    
            readBuffer.pipe(uploadStream);
    
            uploadStream.on("finish", async () => {
                newFile.id = uploadStream.id;
                try {
                    const savingResults = await newFile.save();
                    if (!savingResults) {
                        res.status(404).send("Error occurred while saving the file.");
                    } else {
                        res.status(200).send({ file: savingResults, message: "File uploaded successfully." });
                    }
                } catch (error) {
                    console.error('Error saving file:', error);
                    res.status(500).send("Internal server error occurred while saving the file.");
                }
            });
    
            uploadStream.on("error", (err) => {
                console.error('Error uploading file:', err);
                res.status(500).send("Error occurred while uploading the file.");
            });
        } catch (error) {
            console.error('Error handling file upload:', error);
            res.status(500).send("Internal server error occurred while handling the file upload.");
        }
    }
    
}