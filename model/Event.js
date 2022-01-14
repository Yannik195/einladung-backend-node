const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    name: {
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
        validate: /^[a-z0-9]*$/
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
    organizerId: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    attendencieIds: {
        type: String,
        min: 6,
        max: 255,
    },
})

module.exports = mongoose.model("Event", eventSchema)