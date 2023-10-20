import express from 'express';
import AWS from 'aws-sdk';

const router = express.Router();

const SES_CONFIG= {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
        region: "eu-north-1",
};

const AWS_SES = new AWS.SES(SES_CONFIG);

router.post('/email', async(req, res) => {
    try {
        const {email, message, name} = req.body;
        await sendEmail("platformecommerce54@gmail.com", email, message, name);
        res.send('Email sent successfully');  
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).send('Internal Server Error');
    }
});

async function sendEmail(emailTo, emailFrom, message, name) {
    const params = {
        Destination: {
            ToAddresses: [emailTo],
        },
        Message: {
            Body: {
                Text: {
                    Data: `From User: ${name}\n${message}`,
                },
            },
            Subject: {
                Data: `Name: ${emailFrom}`,
            },
        },
        Source: "platformecommerce54@gmail.com"
    };
    return await AWS_SES.sendEmail(params).promise();
}

export default router;