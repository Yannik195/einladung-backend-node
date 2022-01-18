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
        max: 255,
    },
    time: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    price: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    address: {
        street: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },
        number: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },
        city: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },
        zip: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        }
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizer'
    },
    attendencies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendee'
    }],
})

module.exports = mongoose.model("Event", eventSchema)