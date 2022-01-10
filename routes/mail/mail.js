const nodemailer = require("nodemailer");
const router = require("express").Router()
const generateQRCode = require("./generateQRCode")




async function sendMail(attendee, attendencie, event) {
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
            subject: 'Dein Ticket', // Subject line
            html: `<img src="cid:${attendencie._id}"/>`,
            attachments: [{
                filename: `${attendencie._id}.png`,
                path: `/Users/yanniksimon/code/einladung/backend/routes/mail/QRCodeImages/${attendencie._id}.png`,
                cid: `${attendencie._id}`
            }]
        })
        generateQRCode.deleteQRCode(attendencie._id)
        console.log("Message sent: %s", info.messageId);
    } catch (err) {
        console.log(err)
    }
}
const attendencie = { "_id": "61dc715d2c80296d02e5e116", "firstname": "yannik", "lastname": "simon", "email": "yanniksmail@mail.de", "stripeCustomerId": "cus_KwKdkqK6XjOUez", "__v": 0 }
const event = { "address": { "street": "Augustenstr", "number": "37", "city": "stuttgart", "zip": "70178" }, "_id": "61d0886919326c9f70bdc1e0", "name": "CELEBRATE NEW YEARS EVE 2022 - A SUPREME EXPERIENCE", "subdomain": "sylvester", "description": "Aus der Vergangenheit sind wir es gewohnt: pünktlich zum Jahreswechsel gibt es einen Abgesang auf das vergangene Jahr, der hoffnungsvolle Blick schweift in die Zukunft, jeweils in andere Worte verpackt. Aber wahrscheinlich sind wir uns einig, dass sich dieser Jahreswechsel ganz besonders anfühlt. Wir alle haben höchst außergewöhnliche Zeiten hinter uns und diese wollen wir genau da lassen wo sie hingehören, nämlich in der Vergangenheit! ", "time": "00:00", "date": "2021-01-01", "price": "12", "organizerId": "61cf8fc447fc5f5fa1b8623b", "__v": 0 }

router.post("/", (req, res) => {
    this.sendMail(attendencie, event);
    res.send("Mail sent")
})

exports.sendMail = sendMail
exports.router = router
