const QRCode = require('qrcode')

const generateQRCode = async attendencieId => {
    try {
        const dataUrl = await QRCode.toDataURL(`localhost:3000/api/attendencies/checkin/${attendencieId}`)
        dataUrl.split(",")[1]
        return dataUrl.split(",")[1]
    } catch (err) {
        console.error(err)
    }
}

exports.generateQRCode = generateQRCode