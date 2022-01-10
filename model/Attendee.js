const mongoose = require("mongoose")

const attendeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
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