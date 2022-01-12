const axios = require('axios')
const qrcode = require("../qrcode/qrcode")

const sendTicket = async function () {
    dataUrl = await qrcode.generateQRCode("123")
    axios({
        method: 'post',
        url: 'https://api.postmarkapp.com/email/withTemplate',
        data: {
            "TemplateId": 26680664,
            "TemplateModel": {
                "name": "Yannik Simon",
                "company": {
                    "name": "ACME"
                },
                "product_name": "einladung.app"
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
            "To": "mail@einladung.app",
            "Tag": "Invitation",
            "ReplyTo": "reply@example.com",
            "Metadata": {
                "Color": "blue",
                "Client-Id": "12345"
            },
            "Headers": [
                {
                    "Name": "CUSTOM-HEADER",
                    "Value": "value"
                }
            ],
            "TrackOpens": true,
            "TrackLinks": "HtmlOnly",
            "MessageStream": "outbound"
        }, headers: {
            "X-Postmark-Server-Token": "247ee0fa-daea-4bb8-a933-919800ee4344"
        }
    }).then(res => {
        console.log(`statusCode: ${res.status}`)
        console.log(res)
    }).catch(error => {
        console.error(error)
    })
}

exports.sendTicket = sendTicket