const Event = require("../../model/Event")
const Organizer = require("../../model/Organizer")
const router = require("express").Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const auth = require("../auth/verifyToken")



//create account + onboarding in one
//get organizerid from token

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
    console.log(account)
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
    console.log(req.user)
    const organizerId = req.user.userId

    const account = await stripe.accounts.create({
        type: 'express',
        requested_capabilities: ["card_payments", "transfers"],
        metadata: {
            organizerId,
        }
    });
    console.log("Stripe Account created " + account.id)

    console.log("create onboarding link")

    const onboardingLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'https://example.com/reauth',
        return_url: 'http://localhost:8080/organizer/overview',
        type: 'account_onboarding',
    });

    res.send(onboardingLink)
})

//List all accounts
router.get("/accounts", async (req, res) => {
    const accounts = await stripe.accounts.list()
    res.send(accounts)
})

//List one specific account
router.get("/accounts/:accountId", async (req, res) => {
    const account = await stripe.accounts.retrieve(
        req.params.accountId
    );
    res.send(account)
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
                name: event.name,
                amount: event.price * 100,
                currency: 'eur',
                quantity: 1,
            }],
            payment_intent_data: {
                application_fee_amount: 123,
                transfer_data: {
                    destination: organizer.connectedAccountId,
                },
            },
            metadata: {
                eventId: event.id,
                organizerId: organizer.id,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
            },
            mode: 'payment',
            success_url: `http://localhost:8080/event/${event.subdomain}?success=true`,
            cancel_url: `http://localhost:8080/event/${event.subdomain}?success=false`,
            // success_url: `https://${event.subdomain}.einladung.app?success=true`,
            // cancel_url: `https://${event.subdomain}.einladung.app?success=false`,
        });

        res.send({ "sessionUrl": session.url })
    } catch (err) {
        res.status(400).send(err)
    }
})









exports.router = router