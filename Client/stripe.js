const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')

var Publishable_Key = process.env.Publishable_Key;
var Secret_Key = process.env.Secret_Key;

const stripe = require('stripe')(Secret_Key)

const app = express();

app.use(express.json());
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

// View Engine Setup
app.set('Client', path.join(__dirname, 'Client'))
app.set('view engine', 'html')

app.get('/', function(req, res){
	res.render('Home', {
	key: Publishable_Key
	})
})

app.post('/payment', function(req, res){

	// Moreover you can take more details from user
	// like Address, Name, etc from form
	stripe.customers.create({
		email: req.body.stripeEmail,
		source: req.body.stripeToken,
		name: 'batool shaheen',
		address: {
			line1: 'TC 9/4 Old MES colony',
			postal_code: '452331',
			city: 'Indore',
			state: 'Madhya Pradesh',
			country: 'Palestine',
		}
	})
	.then((customer) => {

		return stripe.charges.create({
			amount: 2500,	 // Charging Rs 25
			description: 'Web Development Product',
			currency: 'USD',
			customer: customer.id
		});
	})
	.then((charge) => {
        console.log(charge)
		res.send("Success") // If no error occurs
	})
	.catch((err) => {
		res.send(err)	 // If some error occurs
	});
})

export default stripe;
// app.listen(port, function(error){
// 	if(error) throw error
// 	console.log("Server created Successfully")
// })