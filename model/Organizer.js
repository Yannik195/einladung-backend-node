const mongoose = require("mongoose")

const organizerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        max: 255,
        required: true,
    },
    lastname: {
        type: String,
        max: 255,
        required: true,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    company: {
        type: String,
        max: 255,
        default: false,
        required: false,
    },
    connectedId: {
        type: String,
        min: 6,
        max: 255,
        default: false,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
})

module.exports = mongoose.model("Organizer", organizerSchema)