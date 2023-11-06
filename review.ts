import express from "express";
import 'dotenv/config';

const router = express.Router();

import aws from 'aws-sdk';
import { User } from "./DB/entities/User.entity.js";

const SESCONFIG = {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.AWS_SES_REGION
}

const ses = new aws.SES(SESCONFIG);

router.post('/email', async (req, res) => {
    const { email, review, name } = req.body;
    try {
        const user = await User.findOneBy({ email: email });
        if (user) {
            sesTest("platformecommerce54@gmail.com", email, review, name);
            res.json({ email, review, name });
        } else {
            res.status(400).json({ error: 'Email not found, Please make sure you are signed up!' });
        }
    } catch (error) {
        console.log('Email sending error:', error);
        res.status(500).send('Internal Server Error');
    }
});

async function sesTest(emailTo: string, emailFrom: string, review: string, name: string) {
    const params = {
        Destination: {
            ToAddresses: [emailTo],
        },
        Message: {
            Body: {
                Text: {
                    Data: `From User: ${name} \n ${review}`,
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