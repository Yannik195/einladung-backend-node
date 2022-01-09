const nodemailer = require("nodemailer");
const router = require("express").Router()
const generateQRCode = require("./generateQRCode")


router.post("/", (req, res) => {
    this.sendMail().catch(console.error);
    res.send("Mail sent")
})

async function sendMail(attendencie) {
    console.log(attendencie)
    let transporter = nodemailer.createTransport({
        host: "smtps.udag.de",
        port: 465,
        secure: true,
        auth: {
            user: process.env.UNITED_DOMAIN_EMAIL_USERNAME,
            pass: process.env.UNITED_DOMAIN_EMAIL_PASSWORD,
        },
    });

    generateQRCode.generateQRCode(attendencie._id)

    try {
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'mail@einladung.app', // sender address
            to: "yannisim@gmail.com", // list of receivers
            subject: "Dein Ticket", // Subject line
            html: `<img src="cid:${attendencie._id}"/>`,
            attachments: [{
                filename: `${attendencie._id}.png`,
                path: `/Users/yanniksimon/code/einladung/backend/routes/mail/QRCodeImages/${attendencie._id}.png`,
                cid: `${attendencie._id}`
            }]
        })
        console.log("Message sent: %s", info.messageId);
    } catch (err) {
        console.log(err)
    }

    //TODO delete image
}

exports.sendMail = sendMail
exports.router = router
