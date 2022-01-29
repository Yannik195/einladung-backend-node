const mongoose = require("mongoose")

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
    },
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