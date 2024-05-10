const nodemailer = require("nodemailer");
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'lesetjamaluleka@gmail.com',
      pass: 'vtonsnqeufjvoqzu',
    },
    tls: {
        rejectUnauthorized: false // Ignore certificate validation errors
    }
  });
  
const sendMail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email has been sent');
    } catch (error) {
        console.error(error);
    }
};

module.exports = sendMail;
