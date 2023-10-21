import express from "express";
import 'dotenv/config';

const router = express.Router();

import aws from 'aws-sdk';

const SESCONFIG ={
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_SES_REGION
}

const ses = new aws.SES(SESCONFIG);

router.post('/email', (req, res) => {
    const {email, message, name} = req.body;
    try {
        sesTest("platformecommerce54@gmail.com", email, message, name);
        res.json({ message: 'Email sent successfully'}); 
    } catch (error) {
        console.log('Email sending error:', error);
        res.status(500).send('Internal Server Error');
    }
});

async function sesTest(emailTo: string, emailFrom: string, message: string, name: string) {
        const params = {
            Destination: {
                ToAddresses: [emailTo],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `From User: ${name} \n ${message}`,
                    },
                },
                Subject: {
                    Data: `Name: ${emailFrom}`,
                },
            },
            Source: "platformecommerce54@gmail.com"
        };
        const res = await ses.sendEmail(params).promise();
        
} 
export default router;