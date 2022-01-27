const express = require("express")
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const handleAccountUpdate = require("./handleAccountUpdate");

//Webhook
router.post('/connect', express.raw({ type: 'application/json' }), (req, res) => {
    console.log("webhook")
    const sig = req.headers['stripe-signature'];

    let event;

    // Verify webhook signature and extract the event.
    // See https://stripe.com/docs/webhooks/signatures for more information.
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET_CONNECT);
        console.log(event.type)
    } catch (err) {
        console.log(`Webhook Error: ${err}`)
        return res.status(400).send(`Webhook Error: ${err}`);
    }

    if (event.type === 'account.updated') {
        console.log("Webhook: account updated")

        const account = event.data.object;
        handleAccountUpdate.handleAccountUpdate(account);
    }

    res.json({ received: true });
});


module.exports = router