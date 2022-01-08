const mongoose = require("mongoose")

const organizerSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 6,
        max: 255,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    connectedAccountId: {
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
})


module.exports = mongoose.model("Organizer", organizerSchema)