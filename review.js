"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.default.Router();
var aws_sdk_1 = require("aws-sdk");

var ses = new aws_sdk_1.default.SES({ region: 'eu-north-1' });

router.post('/email', function (req, res) {
    var _a = req.body, email = _a.email, message = _a.message, name = _a.name;
    try {
        sesTest("platformecommerce54@gmail.com", email, message, name);
        res.send('Email sent successfully');
    }
    catch (error) {
        console.log('Email sending error:', error);
        res.status(500).send('Internal Server Error');
    }
});
async function sesTest(emailTo, emailFrom, message, name) {
    var params = {
        Destination: {
            ToAddresses: [emailTo],
        },
        Message: {
            Body: {
                Text: {
                    Data: "From User: ".concat(name, " \n ").concat(message),
                },
            },
            Subject: {
                Data: "Name: ".concat(emailFrom),
            },
        },
        Source: "platformecommerce54@gmail.com"
    };
    const res = await ses.sendEmail(params).promise();
}
exports.default = router;
