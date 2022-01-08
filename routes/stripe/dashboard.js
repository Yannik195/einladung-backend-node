const router = require("express").Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Organizer = require("../../model/Organizer")
const auth = require("../verifyToken")



router.get("/", auth, async (req, res) => {
    let organizer;
    try {
        organizer = await Organizer.findOne({ _id: req.user.userId })
    } catch (err) {
        console.log(err)
    }

    try {
        const link = await stripe.accounts.createLoginLink(organizer.connectedAccountId);
        res.send(link)
    } catch (err) {
        console.log(err)
    }
})

module.exports = router