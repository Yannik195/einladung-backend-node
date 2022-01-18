const mongoose = require("mongoose")

const ticketSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    attendee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendee'
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