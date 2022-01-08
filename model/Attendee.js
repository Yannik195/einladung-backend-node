const mongoose = require("mongoose")

const attendeeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    stripeCustomerId: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    }
})


module.exports = mongoose.model("Attendee", attendeeSchema)