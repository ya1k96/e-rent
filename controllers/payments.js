const mercadopago = require("mercadopago");
require('dotenv').config();
module.exports = (app) => {
    mercadopago.configurations.setAccessToken(process.env.ACCESS_TOKEN); 
    
    app.post("/payments/create_preference", (req, res) => {
    
        let preference = {
            items: [{
                title: req.body.description,
                unit_price: Number(req.body.price),
                quantity: Number(req.body.quantity),
            }],
            back_urls: {
                "success": "http://localhost:3000/payments/feedback",
                "failure": "http://localhost:3000/payments/feedback",
                "pending": "http://localhost:3000/payments/feedback"
            },
            auto_return: 'approved',
        };
    
        mercadopago.preferences.create(preference)
            .then(function (response) {
                res.json({id :response.body.id})
            }).catch(function (error) {
                console.log(error);
            });
    });
    
    app.get('payments/feedback', function(request, response) {
         response.json({
            Payment: request.query.payment_id,
            Status: request.query.status,
            MerchantOrder: request.query.merchant_order_id
        })
    });

}
