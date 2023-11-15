const express = require('express')
const alertin = require('alertin')
require("dotenv").config();
const app = express();
const port = 5000;
 
app.use(express.json());
 
const generateOTP = () => {
 
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};
 
const userName = process.env.USER_NAME;
const accessKEY = process.env.ACCESS_KEY;
 
app.post('/alertin-sms', (req, res) => {
 
    const alertInClient = alertin.client({
        username: userName,
        accessKey: accessKEY,
    })
 
    const { phoneNumber } = req.body;
 
    const otp = generateOTP();
 
    const recipients = [phoneNumber];
    const header = "INOCYX";
    const route = "T";
    const message = `Hi User ! Here is the OTP ${otp} to login your account. Inocyx`;
    const entityId = process.env.ENTITY_ID;
    const templateId = process.env.TEMPLATE_ID;
 
 
    if (!recipients) {
        return res.status(404).json({ error: "Missing recipients details" })
    }
 
    alertInClient.sendSMS({
        header,
        route,
        message,
        recipients,
        entityId,
        templateId
 
    })
        .then(function (data) {
            console.log(data);
            res.status(200).json(data);
        })
        .catch(function (err) {
            console.error(err)
 
            res.status(400).json({ error: 'Failed to send SMS', details: err })
        })
 
})
 
 
 
 
app.listen(port, () => {
    console.log("Server listening at http://localhost:5000")
})