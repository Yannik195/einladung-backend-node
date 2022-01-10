const router = require("express").Router()
const mailchimp = require("@mailchimp/mailchimp_transactional")(
    process.env.MAILCHIMP_TRANSACTIONAL_API_KEY
);

const message = {
    from_email: "mail@einladung.app",
    subject: "Hello world",
    text: "Welcome to Mailchimp Transactional!",
    to: [
        {
            email: "mail@einladung.app",
            type: "to"
        }
    ]
};


router.get("/", async (req, res) => {
    const response = await mailchimp.messages.send({
        message
    });
    console.log(response);
    res.send(response)
})

module.exports = router