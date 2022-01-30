const Event = require("../../model/Event")
const Organizer = require("../../model/Organizer")
const router = require("express").Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require("../verifyToken")

//Create a new account
router.post("/accounts", async (req, res) => {
    const account = await createStripeAccount(req.body.organizerId)
    res.send(account)
})

exports.createStripeAccount = async (organizerId) => {
    console.log("Create stripe account")
    const account = await stripe.accounts.create({
        type: 'express',
        requested_capabilities: ["card_payments", "transfers"],
        metadata: {
            organizerId,
        }
    });
    return account
}

//get the account link to finish the sign up process to stripe
router.get("/accounts/:accountId/link", async (req, res) => {
    const onboardingLink = await getOnboardingLink(req.params.accountId)
    res.send(onboardingLink)
})

const getOnboardingLink = async (accountId) => {
    const onboardingLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: 'https://example.com/reauth',
        return_url: 'https://example.com/return',
        type: 'account_onboarding',
    });

    return onboardingLink
}

router.get("/onboarding", auth, async (req, res) => {
    //Create stripe account
    const organizerId = req.session.organizerId

    const account = await stripe.accounts.create({
        type: 'express',
        requested_capabilities: ["card_payments", "transfers"],
        metadata: {
            organizerId,
        }
    });
    console.log("Stripe Account created " + account.id)

    const onboardingLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'https://example.com/reauth',
        return_url: process.env.NODE_ENV == "development" ? `http://localhost:8080/organizer/overview` : `https://${process.env.BASE_URL_DOMAIN}.app/organizer/overview`,
        type: 'account_onboarding',
    });

    res.send(onboardingLink)
})

//Buy Ticket
router.post("/buy-ticket", async (req, res) => {
    console.log("buy ticket")
    try {
        const event = await Event.findOne({ subdomain: req.body.subdomain })
        const organizer = await Organizer.findOne({ id: event.organizerId })
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: req.body.email,
            line_items: [{
                name: event.title,
                //credit card fees calc here?
                //price - 1.4% - 0.25
                amount: event.price,
                currency: 'eur',
                quantity: 1,
            }],
            payment_intent_data: {
                application_fee_amount: calcApplicationFeeAmount(event.price),
                transfer_data: {
                    destination: organizer.connectedId,
                },
            },
            metadata: {
                eventId: event.id,
                organizerId: organizer.id,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
            },
            mode: 'payment',
            success_url: process.env.NODE_ENV == "development" ? `http://localhost:8080/event/${event.subdomain}?success=true` : `https://${event.subdomain}.${process.env.BASE_URL_DOMAIN}.app?success=true`,
            cancel_url: process.env.NODE_ENV == "development" ? `http://localhost:8080/event/${event.subdomain}?success=false` : `https://${event.subdomain}.${process.env.BASE_URL_DOMAIN}.app?success=false`,
        });

        res.send({ "sessionUrl": session.url })
    } catch (err) {
        res.status(400).send(err)
    }
})

const calcApplicationFeeAmount = function (price) {
    return price * 0.03 + 20
}

exports.router = router