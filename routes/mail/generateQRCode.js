var QRCode = require('qrcode')
exports.generateQRCode = function (attendencieId,) {
    console.log("generateQRCode")
    console.log(attendencieId)

    QRCode.toFile(`/Users/yanniksimon/code/einladung/backend/routes/mail/QRCodeImages/${attendencieId}.png`, `localhost:3000/api/attendencies/checkin/${attendencieId}`, {
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        },
        margin: 2,
        scale: 16,
    }, function (err) {
        if (err) throw err
        console.log('done')
    })
}
