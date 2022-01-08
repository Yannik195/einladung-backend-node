const mongoose = require("mongoose")

const attendencieSchema = new mongoose.Schema({
    eventId: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    attendeeId: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
})




module.exports = mongoose.model("Attendencie", attendencieSchema)