const axios = require('axios')
const qrcode = require("../qrcode/qrcode")

const sendTicket = async function (event, attendee, ticket, organizer) {
    dataUrl = await qrcode.generateQRCode(ticket.id)
    console.log("ticket")
    console.log(ticket)
    axios({
        method: 'post',
        url: 'https://api.postmarkapp.com/email/withTemplate',
        data: {
            "TemplateId": 26680664,
            "TemplateModel": {
                "product_name": "einladung.app",
                "attendee_name": `${attendee.firstname} ${attendee.lastname}`,
                "event_title": event.title,
                "event_price": event.price / 100,
                "organizer_name": organizer.company != "false" ? `${organizer.company}` : `${organizer.firstname} ${organizer.lastname}`,
                "organizer_email": organizer.email,
                "event_subdomain": event.subdomain,
                "event_date": event.date,
                "event_time": event.time,
                "event_address": event.address,
                "event_address_street": event.address.street,
                "event_address_number": event.address.number,
                "event_address_city": event.address.city,
                "event_address_zip": event.address.zip,
                "ticket_id": ticket.id,
                "ticket_bought_at": ticket.boughtAt,
                "ticket_code": ticket.code,
            },
            Attachments: [
                {
                    "Content": dataUrl,
                    "Name": "123.png",
                    "ContentType": "image/png",
                    "ContentID": "cid:qrcode"
                },
            ],
            "From": "einladung.app <mail@einladung.app>",
            "To": attendee.email,
            "Tag": "Ticket",
            "ReplyTo": "support@einladung.app",
            "TrackOpens": true,
            "TrackLinks": "HtmlOnly",
            "MessageStream": "outbound"
        }, headers: {
            "X-Postmark-Server-Token": process.env.POSTMARK_API_KEY
        }
    }).then(res => {
        console.log(`statusCode: ${res.status}`)
        console.log(res)
    }).catch(error => {
        console.error(error)
    })
}

exports.sendTicket = sendTicket