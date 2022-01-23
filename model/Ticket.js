const mongoose = require("mongoose")

const ticketSchema = new mongoose.Schema({
    checkedIn: {
        type: Boolean,
        default: false,
    },
    checkedInTime: {
        type: Date,
    },
    boughtAt: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = mongoose.model("Ticket", ticketSchema)