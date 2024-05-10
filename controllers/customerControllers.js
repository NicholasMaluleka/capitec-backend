const Customer = require('../models/customer.js')
const Login = require('../models/customerLogin.js')


const bcrypt = require('bcrypt')
// create json web token
const jwt = require('jsonwebtoken')
// Sending email
const sendMail = require('../sendMail.js');

module.exports = {
    registerRoute: async (req, res, next) => {
        try {
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
                html: `<b>Your Account with Capitec has been successfully created</b> <br><br>
               <center> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Capitec_Bank_logo.svg/768px-Capitec_Bank_logo.svg.png" width="250px" height="80px"/> </center>`,
            };
            sendMail(mailOptions);

            res.status(201).send(result)
        } catch (error) {
            res.status(500).send(error)
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
      }
    
}