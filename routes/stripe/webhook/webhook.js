const express = require("express")
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const handleCompletedCheckoutSession = require("./handleCompletedCheckoutSession")
const handleAccountUpdate = require("./handleAccountUpdate");

//Webhook
router.post('/', express.raw({ type: 'application/json' }), (req, res) => {
    console.log("webhook")
    const sig = req.headers['stripe-signature'];

    let event;

    // Verify webhook signature and extract the event.
    // See https://stripe.com/docs/webhooks/signatures for more information.
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log(event.type)
    } catch (err) {
        console.log(`Webhook Error: ${err}`)

        return res.status(400).send(`Webhook Error: ${err}`);
    }

    if (event.type === 'checkout.session.completed') {
        console.log("Webhook: checkout session completed")

        const session = event.data.object;
        handleCompletedCheckoutSession.handleCompletedCheckoutSession(session);
    } else if (event.type === 'account.updated') {
        console.log("Webhook: account updated")

        const account = event.data.object;
        handleAccountUpdate.handleAccountUpdate(account);
    } else if (event.type === "person.created") {
        console.log("user submitted first details")
        //todo if they abort do this: https://stripe.com/docs/connect/express-accounts#handle-users-not-completed-onboarding
    }

    res.json({ received: true });
});


module.exports = router