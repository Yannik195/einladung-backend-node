const QRCode = require('qrcode')
const fs = require('fs')


exports.generateQRCode = function (attendencieId) {
    console.log("generateQRCode")
    console.log(attendencieId)

    QRCode.toFile(`/Users/yanniksimon/code/einladung/backend/routes/mail/QRCodeImages/${attendencieId}.png`, `localhost:3000/api/attendencies/checkin/${attendencieId}`, {
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        },
        margin: 2,
        scale: 8,
    }, function (err) {
        if (err) throw err
        console.log('done')
    })
}

exports.deleteQRCode = function (attendencieId) {
    fs.unlink(`/Users/yanniksimon/code/einladung/backend/routes/mail/QRCodeImages/${attendencieId}.png`, (err) => {
        if (err) throw err;
    });
}
