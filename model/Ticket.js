const mongoose = require("mongoose")

const ticketSchema = new mongoose.Schema({
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
    checkedIn: {
        type: Boolean,
        default: false,
    },
    checkedInTime: {
        type: String,
    },
    boughtAt: {
        type: Date,
        default: Date.now(),
    }
})




module.exports = mongoose.model("Ticket", ticketSchema)