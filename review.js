var AWS = require('aws-sdk');

const router = express.Router();

AWS.config.update({region: 'eu-north-1'});

router.post('/email', (req, res) => {
    const {email, message, name} = req.body;
    try {
        console.log("hii");
        sendEmail("platformecommerce54@gmail.com", email, message, name);
        res.send('Email sent successfully');  
    } catch (error) {
        console.send('Email sending error:', error);
        res.status(500).send('Internal Server Error');
    }
});

function sendEmail(emailTo, emailFrom, message, name){
    var params = {
        Destination: {
          CcAddresses: [
            emailFrom,
          ],
          ToAddresses: [
            emailTo
          ]
        },
        Message: { 
          Body: { 
            Html: {
             Charset: "UTF-8",
             Data: "HTML_FORMAT_BODY"
            },
            Text: {
             Charset: "UTF-8",
             Data: `From User: ${name}\n${message}`
            }
           },
           Subject: {
            Charset: 'UTF-8',
            Data: `Name: ${emailFrom}`
           }
          },
        Source: "platformecommerce54@gmail.com",
      };
    
      var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    
      sendPromise.then(
        function(data) {
          console.log(data.MessageId);
        }).catch(
          function(err) {
          console.error(err, err.stack);
        });

}
// function sendEmail(emailTo, emailFrom, message, name) {
//     const params = {
//         Destination: {
//             ToAddresses: [emailTo],
//         },
//         Message: {
//             Body: {
//                 Text: {
//                     Charset: 'UTF-8',
//                     Data: `From User: ${name}\n${message}`,
//                 },
//             },
//             Subject: {
//                 Charset: 'UTF-8',
//                 Data: `Name: ${emailFrom}`,
//             },
//         },
//         Source: "platformecommerce54@gmail.com"
//     };
// }

export default router;