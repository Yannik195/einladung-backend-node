const mailchimp = require("@mailchimp/mailchimp_marketing");
const router = require("express").Router()


mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: "us20",
});

router.post("/contacts", async (req, res) => {
    console.log("add contact")
    const listId = "6e6ac8bb9b";
    try {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: req.body.email,
            status: "subscribed",
        })
        res.send(response)
    } catch (err) {
        res.send(err)
    }
})

router.get("/audience", async (req, res) => {
    try {
        const response = await client.lists.getAllLists();
        res.send(response)
    } catch (err) {
        res.send(err)
    }
})

router.post("/audience", async (req, res) => {
    const event = {
        name: "JS Developers Meetup"
    };

    const footerContactInfo = {
        company: "Mailchimp",
        address1: "675 Ponce de Leon Ave NE",
        address2: "Suite 5000",
        city: "Atlanta",
        state: "GA",
        zip: "30308",
        country: "US"
    };

    const campaignDefaults = {
        from_name: "Gettin' Together",
        from_email: "gettintogether@example.com",
        subject: "JS Developers Meetup",
        language: "EN_US"
    };

    try {
        const response = await mailchimp.lists.createList({
            name: event.name,
            contact: footerContactInfo,
            permission_reminder: "permission_reminder",
            email_type_option: true,
            campaign_defaults: campaignDefaults
        });

        res.send(
            `Successfully created an audience. The audience id is ${response.id}.`
        );
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router
