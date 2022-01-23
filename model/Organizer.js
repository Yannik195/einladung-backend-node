const mongoose = require("mongoose")

const organizerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        max: 255,
    },
    lastname: {
        type: String,
        max: 255,
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
    },
    connectedId: {
        type: String,
        min: 6,
        max: 255,
    },
    details_submitted: {
        type: String,
        default: false
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    address: {
        street: {
            type: String,
            required: false,
            min: 6,
            max: 255,
        },
        number: {
            type: String,
            required: false,
            min: 6,
            max: 255,
        },
        city: {
            type: String,
            required: false,
            min: 6,
            max: 255,
        },
        zip: {
            type: String,
            required: false,
            min: 6,
            max: 255,
        }
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
})


module.exports = mongoose.model("Organizer", organizerSchema)