const router = require("express").Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require("../verifyToken")

router.get("/", auth, async (req, res) => {
    try {
        const link = await stripe.accounts.createLoginLink(req.session.connectedId);
        res.send(link)
    } catch (err) {
        console.log(err)
    }
})

module.exports = router