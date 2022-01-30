const express = require("express")
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const handleCompletedCheckoutSession = require("./handleCompletedCheckoutSession")

//Webhook
router.post('/', express.raw({ type: 'application/json' }), (req, res) => {
    console.log("webhook")
    const sig = req.headers['stripe-signature'];

    let event;

    // Verify webhook signature and extract the event.
    // See https://stripe.com/docs/webhooks/signatures for more information.
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET_DIRECT);
    } catch (err) {
        console.log(`Webhook Error: ${err}`)
        return res.status(400).send(`Webhook Error: ${err}`);
    }

    if (event.type === 'checkout.session.completed') {
        console.log("Webhook: checkout session completed")

        const session = event.data.object;
        handleCompletedCheckoutSession.handleCompletedCheckoutSession(session);
    }

    res.json({ received: true });
});


module.exports = router