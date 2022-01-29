const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    subdomain: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    description: {
        type: String,
        required: true,
        min: 6,
        max: 2047,
    },
    time: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        min: Date.now()
    },
    price: {
        type: String,
        required: true,
    },
    address: {
        street: {
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        zip: {
            type: String,
            required: true,
            min: 5,
            max: 5,
        }
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendee'
    }],
})

module.exports = mongoose.model("Event", eventSchema)